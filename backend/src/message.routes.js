import express from 'express';
import Conversation from '../data/conversation.model.js';
import Message from '../data/message.model.js';
import { authUser } from '../authmiddleware/auth.js';

const router = express.Router();

const participantFields = 'name firstName lastName username avatar';

// ============ CREATE or GET Conversation ============
router.post('/api/conversations', authUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const { recipientId, propertyId } = req.body;

        if (!recipientId) {
            return res.status(400).json({ message: 'recipientId is required' });
        }

        if (recipientId === userId) {
            return res.status(400).json({ message: 'Cannot start a conversation with yourself' });
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [userId, recipientId], $size: 2 }
        });

        if (!conversation) {
            conversation = new Conversation({
                participants: [userId, recipientId],
                property: propertyId || undefined
            });
            await conversation.save();
        }

        await conversation.populate('participants', participantFields);

        res.status(201).json({ success: true, conversation });
    } catch (error) {
        console.error('Error creating conversation:', error);
        res.status(500).json({ message: 'Error creating conversation' });
    }
});

// ============ LIST Conversations ============
router.get('/api/conversations', authUser, async (req, res) => {
    try {
        const userId = req.user.id;

        const conversations = await Conversation.find({ participants: userId })
            .sort({ lastMessageAt: -1 })
            .populate('participants', participantFields)
            .populate('property', 'title images')
            .lean();

        res.json({ success: true, conversations });
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ message: 'Error fetching conversations' });
    }
});

// ============ GET Messages in a Conversation ============
router.get('/api/conversations/:id/messages', authUser, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const conversation = await Conversation.findById(id);
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }
        if (!conversation.participants.some((p) => p.toString() === userId)) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const messages = await Message.find({ conversation: id })
            .sort({ createdAt: 1 })
            .lean();

        res.json({ success: true, messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Error fetching messages' });
    }
});

// ============ SEND Message ============
router.post('/api/conversations/:id/messages', authUser, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({ message: 'Message text is required' });
        }

        const conversation = await Conversation.findById(id);
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }
        if (!conversation.participants.some((p) => p.toString() === userId)) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const message = new Message({
            conversation: id,
            sender: userId,
            text: text.trim()
        });
        await message.save();

        conversation.lastMessage = message.text;
        conversation.lastMessageAt = message.createdAt;
        await conversation.save();

        res.status(201).json({ success: true, message });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Error sending message' });
    }
});

export default router;
