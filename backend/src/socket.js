import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Conversation from '../data/conversation.model.js';

let io = null;

// userId -> Set of socket ids
const onlineUsers = new Map();

function extractToken(socket) {
    const authToken = socket.handshake.auth?.token;
    if (authToken) return authToken;

    const cookieHeader = socket.handshake.headers.cookie || '';
    const match = cookieHeader.match(/accessToken=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
}

export function initSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: ['https://myloginproject.vercel.app', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
            credentials: true
        }
    });

    io.use((socket, next) => {
        const token = extractToken(socket);
        if (!token) return next(new Error('Unauthorized'));

        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            socket.userId = decoded.id;
            next();
        } catch {
            next(new Error('Unauthorized'));
        }
    });

    io.on('connection', async (socket) => {
        const userId = socket.userId;

        if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
        const sockets = onlineUsers.get(userId);
        const wasOffline = sockets.size === 0;
        sockets.add(socket.id);

        const conversations = await Conversation.find({ participants: userId }).select('_id');
        conversations.forEach((conv) => socket.join(`conversation:${conv._id}`));

        if (wasOffline) {
            conversations.forEach((conv) => {
                io.to(`conversation:${conv._id}`).emit('presence', { userId, online: true });
            });
        }

        socket.on('typing', ({ conversationId }) => {
            if (!conversationId) return;
            socket.to(`conversation:${conversationId}`).emit('typing', { conversationId, userId });
        });

        socket.on('stop-typing', ({ conversationId }) => {
            if (!conversationId) return;
            socket.to(`conversation:${conversationId}`).emit('stop-typing', { conversationId, userId });
        });

        socket.on('disconnect', () => {
            const userSockets = onlineUsers.get(userId);
            if (!userSockets) return;

            userSockets.delete(socket.id);
            if (userSockets.size === 0) {
                onlineUsers.delete(userId);
                conversations.forEach((conv) => {
                    io.to(`conversation:${conv._id}`).emit('presence', { userId, online: false });
                });
            }
        });
    });

    return io;
}

export function getIO() {
    return io;
}

export function isUserOnline(userId) {
    return onlineUsers.has(userId.toString());
}

// Make a user's currently connected sockets join a conversation room (e.g. right after it's created)
export function joinConversationRoom(userId, conversationId) {
    if (!io) return;
    const sockets = onlineUsers.get(userId.toString());
    if (!sockets) return;

    sockets.forEach((socketId) => {
        const socket = io.sockets.sockets.get(socketId);
        if (socket) socket.join(`conversation:${conversationId}`);
    });
}
