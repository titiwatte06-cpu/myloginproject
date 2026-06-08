import { useEffect, useState } from 'react';
import PropertyManagement from '../components/PropertyManagement';

export default function PropertyPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is authenticated
        const checkAuth = async () => {
            try {
                const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').trim();
                const response = await fetch(`${apiUrl}/api/user/properties`, {
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });
                
                if (response.ok) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                setIsLoggedIn(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f5f5f5',
                fontSize: '16px',
                color: '#666'
            }}>
                Loading...
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f5f5f5',
                flexDirection: 'column',
                gap: '16px',
                textAlign: 'center'
            }}>
                <h2 style={{ color: '#333' }}>Please log in to manage properties</h2>
                <p style={{ color: '#666' }}>You need to be authenticated to access this page</p>
            </div>
        );
    }

    return <PropertyManagement />;
}
