import { apiUrl } from '../config/api.js';

function authHeaders() {
    const token = localStorage.getItem('accessToken');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
}

// Create or get an existing conversation with another user
export async function createConversation(recipientId, propertyId) {
    const response = await fetch(`${apiUrl}/api/conversations`, {
        method: 'POST',
        credentials: 'include',
        headers: authHeaders(),
        body: JSON.stringify({ recipientId, propertyId })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to start conversation');
    }
    return await response.json();
}

// List the current user's conversations
export async function fetchConversations() {
    const response = await fetch(`${apiUrl}/api/conversations`, {
        method: 'GET',
        credentials: 'include',
        headers: authHeaders()
    });

    if (!response.ok) throw new Error('Failed to fetch conversations');
    return await response.json();
}

// Get messages for a conversation
export async function fetchMessages(conversationId) {
    const response = await fetch(`${apiUrl}/api/conversations/${conversationId}/messages`, {
        method: 'GET',
        credentials: 'include',
        headers: authHeaders()
    });

    if (!response.ok) throw new Error('Failed to fetch messages');
    return await response.json();
}

// Send a message in a conversation
export async function sendMessage(conversationId, text) {
    const response = await fetch(`${apiUrl}/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        credentials: 'include',
        headers: authHeaders(),
        body: JSON.stringify({ text })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send message');
    }
    return await response.json();
}

// Mark all messages from the other participant as read
export async function markConversationRead(conversationId) {
    const response = await fetch(`${apiUrl}/api/conversations/${conversationId}/read`, {
        method: 'PATCH',
        credentials: 'include',
        headers: authHeaders()
    });

    if (!response.ok) throw new Error('Failed to mark conversation as read');
    return await response.json();
}

// Edit a message (sender only)
export async function editMessage(conversationId, messageId, text) {
    const response = await fetch(`${apiUrl}/api/conversations/${conversationId}/messages/${messageId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: authHeaders(),
        body: JSON.stringify({ text })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to edit message');
    }
    return await response.json();
}

// Unsend a message - deletes it for everyone (sender only)
export async function unsendMessage(conversationId, messageId) {
    const response = await fetch(`${apiUrl}/api/conversations/${conversationId}/messages/${messageId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: authHeaders()
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to unsend message');
    }
    return await response.json();
}

// Hide a message - only removes it from the current user's view
export async function hideMessage(conversationId, messageId) {
    const response = await fetch(`${apiUrl}/api/conversations/${conversationId}/messages/${messageId}/hide`, {
        method: 'PATCH',
        credentials: 'include',
        headers: authHeaders()
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete message');
    }
    return await response.json();
}
