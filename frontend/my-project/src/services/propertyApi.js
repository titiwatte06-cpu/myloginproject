const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').trim();

// Get all properties with filters
export async function fetchProperties(filters = {}) {
    try {
        const params = new URLSearchParams();
        if (filters.propertyType) params.append('propertyType', filters.propertyType);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
        if (filters.status) params.append('status', filters.status);

        const response = await fetch(`${apiUrl}/api/properties?${params.toString()}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Failed to fetch properties');
        return await response.json();
    } catch (error) {
        console.error('Error fetching properties:', error);
        throw error;
    }
}

// Get single property
export async function fetchPropertyById(id) {
    try {
        const response = await fetch(`${apiUrl}/api/properties/${id}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Failed to fetch property');
        return await response.json();
    } catch (error) {
        console.error('Error fetching property:', error);
        throw error;
    }
}

// Create new property
export async function createProperty(propertyData) {
    try {
        const response = await fetch(`${apiUrl}/api/properties`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(propertyData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create property');
        }
        return await response.json();
    } catch (error) {
        console.error('Error creating property:', error);
        throw error;
    }
}

// Update property
export async function updateProperty(id, propertyData) {
    try {
        const response = await fetch(`${apiUrl}/api/properties/${id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(propertyData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update property');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating property:', error);
        throw error;
    }
}

// Delete property
export async function deleteProperty(id) {
    try {
        const response = await fetch(`${apiUrl}/api/properties/${id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete property');
        }
        return await response.json();
    } catch (error) {
        console.error('Error deleting property:', error);
        throw error;
    }
}

// Get user's properties
export async function fetchUserProperties() {
    try {
        const response = await fetch(`${apiUrl}/api/user/properties`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Failed to fetch user properties');
        return await response.json();
    } catch (error) {
        console.error('Error fetching user properties:', error);
        throw error;
    }
}

// Get public profile by username
export async function fetchUserProfile(username) {
    try {
        const response = await fetch(`${apiUrl}/profile/${username}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Failed to fetch profile');
        return await response.json();
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
}

// Get a user's listings by username
export async function fetchPropertiesByUsername(username) {
    try {
        const response = await fetch(`${apiUrl}/api/users/${username}/properties`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Failed to fetch user listings');
        return await response.json();
    } catch (error) {
        console.error('Error fetching user listings:', error);
        throw error;
    }
}

// Add review to property
export async function addReview(propertyId, reviewData) {
    try {
        const response = await fetch(`${apiUrl}/api/properties/${propertyId}/reviews`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to add review');
        }
        return await response.json();
    } catch (error) {
        console.error('Error adding review:', error);
        throw error;
    }
}
