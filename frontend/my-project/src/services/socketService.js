import { io } from 'socket.io-client';
import { apiUrl } from '../config/api.js';

let socket = null;

export function connectSocket() {
    if (socket?.connected) return socket;

    const token = localStorage.getItem('accessToken');
    socket = io(apiUrl, {
        auth: { token },
        withCredentials: true
    });

    return socket;
}

export function getSocket() {
    return socket;
}

export function disconnectSocket() {
    socket?.disconnect();
    socket = null;
}
