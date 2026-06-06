import { useEffect, useState } from 'react';
import { fetchUserProperties, deleteProperty } from '../services/propertyApi';

export default function MyListings({ onEditProperty, onPostNew, onViewProperty }) {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        loadUserProperties();
    }, []);

    const loadUserProperties = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await fetchUserProperties();
            setProperties(data.properties || []);
        } catch (err) {
            setError(err.message || 'Failed to load properties');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteProperty(id);
            setProperties(prev => prev.filter(p => p._id !== id));
            setDeleteConfirm(null);
        } catch (err) {
            setError(err.message || 'Failed to delete property');
        }
    };

    const getStatusBadgeColor = (status) => {
        switch(status) {
            case 'active': return '#4caf50';
            case 'sold': return '#f44336';
            case 'rented': return '#2196f3';
            case 'inactive': return '#9e9e9e';
            default: return '#999';
        }
    };

    return (
        <div className="my-listings">
            <style>{`
                .my-listings {
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: 32px 16px;
                }
                .listings-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 32px;
                }
                .listings-header h1 {
                    margin: 0;
                    font-size: 28px;
                    color: #333;
                }
                .btn-post-new {
                    background: #1976d2;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.3s;
                }
                .btn-post-new:hover {
                    background: #1565c0;
                }
                .listings-grid {
                    display: grid;
                    gap: 16px;
                }
                .listing-card {
                    background: white;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    display: flex;
                    transition: box-shadow 0.3s;
                }
                .listing-card:hover {
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }
                .listing-image {
                    width: 200px;
                    height: 150px;
                    object-fit: cover;
                    flex-shrink: 0;
                }
                .listing-content {
                    flex: 1;
                    padding: 16px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
                .listing-header {
                    margin-bottom: 8px;
                }
                .listing-title {
                    font-size: 18px;
                    font-weight: 600;
                    margin: 0 0 8px 0;
                    color: #333;
                }
                .listing-meta {
                    display: flex;
                    gap: 16px;
                    font-size: 13px;
                    color: #666;
                    margin-bottom: 8px;
                }
                .meta-item {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
                .status-badge {
                    display: inline-block;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    color: white;
                    margin-bottom: 8px;
                }
                .listing-price {
                    font-size: 16px;
                    font-weight: 700;
                    color: #1976d2;
                    margin-bottom: 12px;
                }
                .listing-stats {
                    display: flex;
                    gap: 16px;
                    font-size: 12px;
                    color: #999;
                    margin-bottom: 12px;
                }
                .listing-actions {
                    display: flex;
                    gap: 8px;
                }
                .btn {
                    padding: 8px 16px;
                    border-radius: 4px;
                    border: none;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .btn-edit {
                    background: #2196f3;
                    color: white;
                }
                .btn-edit:hover {
                    background: #1976d2;
                }
                .btn-delete {
                    background: #f44336;
                    color: white;
                }
                .btn-delete:hover {
                    background: #d32f2f;
                }
                .empty-state {
                    text-align: center;
                    padding: 48px 16px;
                }
                .empty-icon {
                    font-size: 48px;
                    margin-bottom: 16px;
                }
                .empty-text {
                    color: #666;
                    margin-bottom: 16px;
                }
                .error {
                    background: #ffebee;
                    color: #c62828;
                    padding: 12px;
                    border-radius: 6px;
                    margin-bottom: 16px;
                }
                .loading {
                    text-align: center;
                    padding: 32px;
                    color: #999;
                }
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                .modal {
                    background: white;
                    border-radius: 8px;
                    padding: 24px;
                    max-width: 400px;
                    box-shadow: 0 4px 24px rgba(0,0,0,0.15);
                }
                .modal h3 {
                    margin-top: 0;
                    margin-bottom: 16px;
                    color: #333;
                }
                .modal-actions {
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                    margin-top: 24px;
                }
                .modal-btn {
                    padding: 10px 20px;
                    border-radius: 4px;
                    border: none;
                    font-weight: 600;
                    cursor: pointer;
                }
                .modal-btn-cancel {
                    background: #e0e0e0;
                    color: #333;
                }
                .modal-btn-confirm {
                    background: #f44336;
                    color: white;
                }
                @media (max-width: 600px) {
                    .listing-card {
                        flex-direction: column;
                    }
                    .listing-image {
                        width: 100%;
                        height: 200px;
                    }
                }
            `}</style>

            <div className="listings-header">
                <h1>My Listings</h1>
                <button className="btn-post-new" onClick={onPostNew}>
                    + Post New Property
                </button>
            </div>

            {error && <div className="error">{error}</div>}

            {loading ? (
                <div className="loading">Loading your properties...</div>
            ) : properties.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">🏠</div>
                    <div className="empty-text">
                        <p>You haven't posted any properties yet</p>
                        <p>Start by creating your first listing</p>
                    </div>
                    <button className="btn-post-new" onClick={onPostNew}>
                        + Post Your First Property
                    </button>
                </div>
            ) : (
                <div className="listings-grid">
                    {properties.map(property => (
                        <div key={property._id} className="listing-card">
                            {property.images && property.images[0] ? (
                                <img src={property.images[0].url} alt={property.title} className="listing-image" />
                            ) : (
                                <div className="listing-image" style={{ background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                                    No Image
                                </div>
                            )}

                            <div className="listing-content">
                                <div>
                                    <div className="listing-header">
                                        <h3
                                            className="listing-title"
                                            onClick={() => onViewProperty?.(property)}
                                            style={{ cursor: 'pointer', color: '#1976d2' }}
                                        >
                                            {property.title}
                                        </h3>
                                        <div className="status-badge" style={{ backgroundColor: getStatusBadgeColor(property.status) }}>
                                            {property.status.toUpperCase()}
                                        </div>
                                    </div>

                                    <div className="listing-meta">
                                        <div className="meta-item">📍 {property.location?.district || 'N/A'}</div>
                                        <div className="meta-item">📐 {property.area} sqm</div>
                                        <div className="meta-item">🛏️ {property.bedrooms} BR</div>
                                    </div>

                                    <div className="listing-price">
                                        ฿{property.price.toLocaleString()}
                                    </div>

                                    <div className="listing-stats">
                                        <span>👁️ {property.viewCount || 0} views</span>
                                        <span>⭐ {property.reviews?.length || 0} reviews</span>
                                        <span>📅 {new Date(property.createdAt).toLocaleDateString('th-TH')}</span>
                                    </div>
                                </div>

                                <div className="listing-actions">
                                    <button
                                        className="btn btn-edit"
                                        onClick={() => onEditProperty?.(property)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-delete"
                                        onClick={() => setDeleteConfirm(property._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {deleteConfirm && (
                <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Delete Property?</h3>
                        <p>Are you sure you want to delete this listing? This action cannot be undone.</p>
                        <div className="modal-actions">
                            <button className="modal-btn modal-btn-cancel" onClick={() => setDeleteConfirm(null)}>
                                Cancel
                            </button>
                            <button
                                className="modal-btn modal-btn-confirm"
                                onClick={() => handleDelete(deleteConfirm)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
