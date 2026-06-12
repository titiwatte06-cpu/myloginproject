import express from 'express';
import Conversation from '../data/conversation.model.js';
import Message from '../data/message.model.js';
import { authUser } from '../authmiddleware/auth.js';
import { getIO, joinConversationRoom } from './socket.js';

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

            joinConversationRoom(userId, conversation._id);
            joinConversationRoom(recipientId, conversation._id);
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

        const messages = await Message.find({ conversation: id, deletedFor: { $ne: userId } })
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

        const io = getIO();
        if (io) {
            io.to(`conversation:${id}`).emit('new-message', {
                conversationId: id,
                message
            });
            io.to(`conversation:${id}`).emit('conversation-updated', {
                conversationId: id,
                lastMessage: conversation.lastMessage,
                lastMessageAt: conversation.lastMessageAt,
                senderId: userId
            });
        }

        res.status(201).json({ success: true, message });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Error sending message' });
    }
});

// ============ MARK Conversation as Read ============
router.patch('/api/conversations/:id/read', authUser, async (req, res) => {
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

        const unread = await Message.find({
            conversation: id,
            sender: { $ne: userId },
            readBy: { $ne: userId }
        }).select('_id');

        if (unread.length > 0) {
            const messageIds = unread.map((m) => m._id);
            await Message.updateMany(
                { _id: { $in: messageIds } },
                { $addToSet: { readBy: userId } }
            );

            const io = getIO();
            if (io) {
                io.to(`conversation:${id}`).emit('messages-read', {
                    conversationId: id,
                    userId,
                    messageIds
                });
            }
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error marking conversation as read:', error);
        res.status(500).json({ message: 'Error marking conversation as read' });
    }
});

// ============ EDIT Message ============
router.patch('/api/conversations/:id/messages/:messageId', authUser, async (req, res) => {
    try {
        const { id, messageId } = req.params;
        const userId = req.user.id;
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({ message: 'Message text is required' });
        }

        const message = await Message.findById(messageId);
        if (!message || message.conversation.toString() !== id) {
            return res.status(404).json({ message: 'Message not found' });
        }
        if (message.sender.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        message.editHistory.push(message.text);
        message.text = text.trim();
        message.edited = true;
        message.editedAt = new Date();
        await message.save();

        const conversation = await Conversation.findById(id);
        if (conversation.lastMessageAt.getTime() === message.createdAt.getTime()) {
            conversation.lastMessage = message.text;
            await conversation.save();
        }

        const io = getIO();
        if (io) {
            io.to(`conversation:${id}`).emit('message-edited', {
                conversationId: id,
                message
            });
        }

        res.json({ success: true, message });
    } catch (error) {
        console.error('Error editing message:', error);
        res.status(500).json({ message: 'Error editing message' });
    }
});

// ============ UNSEND Message (delete for everyone) ============
router.delete('/api/conversations/:id/messages/:messageId', authUser, async (req, res) => {
    try {
        const { id, messageId } = req.params;
        const userId = req.user.id;

        const message = await Message.findById(messageId);
        if (!message || message.conversation.toString() !== id) {
            return res.status(404).json({ message: 'Message not found' });
        }
        if (message.sender.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await Message.deleteOne({ _id: messageId });

        const conversation = await Conversation.findById(id);
        const latest = await Message.findOne({ conversation: id }).sort({ createdAt: -1 });
        conversation.lastMessage = latest ? latest.text : '';
        conversation.lastMessageAt = latest ? latest.createdAt : conversation.createdAt;
        await conversation.save();

        const io = getIO();
        if (io) {
            io.to(`conversation:${id}`).emit('message-deleted', {
                conversationId: id,
                messageId
            });
            io.to(`conversation:${id}`).emit('conversation-updated', {
                conversationId: id,
                lastMessage: conversation.lastMessage,
                lastMessageAt: conversation.lastMessageAt,
                senderId: userId
            });
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error unsending message:', error);
        res.status(500).json({ message: 'Error unsending message' });
    }
});

// ============ DELETE Message for me only ============
router.patch('/api/conversations/:id/messages/:messageId/hide', authUser, async (req, res) => {
    try {
        const { id, messageId } = req.params;
        const userId = req.user.id;

        const conversation = await Conversation.findById(id);
        if (!conversation || !conversation.participants.some((p) => p.toString() === userId)) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const message = await Message.findById(messageId);
        if (!message || message.conversation.toString() !== id) {
            return res.status(404).json({ message: 'Message not found' });
        }
        if (!message.deletedFor.some((u) => u.toString() === userId)) {
            message.deletedFor.push(userId);
            await message.save();
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error hiding message:', error);
        res.status(500).json({ message: 'Error hiding message' });
    }
});

export default router;
