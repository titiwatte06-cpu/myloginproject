const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').trim();

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
