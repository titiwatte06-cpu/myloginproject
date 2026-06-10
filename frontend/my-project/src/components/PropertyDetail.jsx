import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPropertyById, addReview } from '../services/propertyApi';
import { createConversation } from '../services/messageApi';

export default function PropertyDetail({ propertyId, onClose }) {
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedImage, setSelectedImage] = useState(0);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const [showSendMessage, setShowSendMessage] = useState(false);
    const [startingChat, setStartingChat] = useState(false);

    useEffect(() => {
        loadProperty();
    }, [propertyId]);

    const loadProperty = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await fetchPropertyById(propertyId);
            setProperty(data.property);
        } catch (err) {
            setError(err.message || 'Failed to load property');
        } finally {
            setLoading(false);
        }
    };

    const handleAddReview = async (e) => {
        e.preventDefault();
        if (!reviewComment.trim()) {
            setError('Please write a comment');
            return;
        }

        try {
            setSubmittingReview(true);
            setError('');
            await addReview(propertyId, {
                rating: reviewRating,
                comment: reviewComment
            });
            setReviewComment('');
            setReviewRating(5);
            await loadProperty();
        } catch (err) {
            setError(err.message || 'Failed to add review');
        } finally {
            setSubmittingReview(false);
        }
    };

    const handleStartChat = async () => {
        const ownerId = property?.ownerId?._id || property?.ownerId;
        if (!ownerId) return;

        try {
            setStartingChat(true);
            setError('');
            const data = await createConversation(ownerId, property._id);
            navigate(`/messages/${data.conversation._id}`);
        } catch (err) {
            setError(err.message || 'Failed to start conversation');
        } finally {
            setStartingChat(false);
        }
    };

    const averageRating = property?.reviews?.length > 0
        ? (property.reviews.reduce((sum, r) => sum + r.rating, 0) / property.reviews.length).toFixed(1)
        : 0;

    if (loading) {
        return (
            <div className="property-detail" style={{ textAlign: 'center', padding: '40px' }}>
                <p>Loading property...</p>
            </div>
        );
    }

    if (error && !property) {
        return (
            <div className="property-detail" style={{ textAlign: 'center', padding: '40px' }}>
                <p style={{ color: 'red' }}>Error: {error}</p>
                <button onClick={onClose} style={{ marginTop: '16px' }}>Close</button>
            </div>
        );
    }

    if (!property) {
        return null;
    }

    return (
        <div className="property-detail">
            <style>{`
                .property-detail {
                    max-width: 900px;
                    margin: 0 auto;
                    padding: 32px 16px;
                    background: white;
                }
                .close-btn {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    float: right;
                    color: #666;
                }
                .close-btn:hover {
                    color: #333;
                }
                .detail-header {
                    clear: both;
                    margin-bottom: 24px;
                }
                .detail-title {
                    font-size: 28px;
                    font-weight: 700;
                    margin-bottom: 8px;
                    color: #333;
                }
                .detail-meta {
                    display: flex;
                    gap: 16px;
                    font-size: 14px;
                    color: #666;
                    margin-bottom: 16px;
                }
                .price-badge {
                    font-size: 24px;
                    font-weight: 700;
                    color: #1976d2;
                    background: #e3f2fd;
                    padding: 12px 16px;
                    border-radius: 8px;
                    display: inline-block;
                }
                .status-badge {
                    display: inline-block;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    color: white;
                    margin-left: 12px;
                    background: #4caf50;
                }
                .gallery {
                    margin-bottom: 32px;
                }
                .main-image {
                    width: 100%;
                    height: 400px;
                    border-radius: 8px;
                    object-fit: cover;
                    margin-bottom: 12px;
                }
                .thumbnail-list {
                    display: flex;
                    gap: 8px;
                    overflow-x: auto;
                }
                .thumbnail {
                    width: 80px;
                    height: 80px;
                    border-radius: 6px;
                    cursor: pointer;
                    border: 2px solid transparent;
                    transition: all 0.3s;
                    object-fit: cover;
                }
                .thumbnail:hover,
                .thumbnail.active {
                    border-color: #1976d2;
                    transform: scale(1.05);
                }
                .content-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 32px;
                }
                .section {
                    margin-bottom: 32px;
                }
                .section-title {
                    font-size: 18px;
                    font-weight: 600;
                    margin-bottom: 16px;
                    color: #333;
                }
                .description {
                    line-height: 1.6;
                    color: #666;
                    margin-bottom: 16px;
                }
                .property-specs {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 12px;
                }
                .spec-item {
                    background: #f5f5f5;
                    padding: 12px;
                    border-radius: 6px;
                }
                .spec-label {
                    font-size: 12px;
                    color: #999;
                    text-transform: uppercase;
                }
                .spec-value {
                    font-size: 16px;
                    font-weight: 600;
                    color: #333;
                }
                .tag-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-top: 8px;
                }
                .tag {
                    background: #e3f2fd;
                    color: #1976d2;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                }
                .owner-card {
                    background: #f9f9f9;
                    padding: 16px;
                    border-radius: 8px;
                    border: 1px solid #e0e0e0;
                }
                .owner-name {
                    font-weight: 600;
                    margin-bottom: 8px;
                    color: #333;
                }
                .owner-detail {
                    font-size: 13px;
                    color: #666;
                    margin-bottom: 4px;
                }
                .contact-btn {
                    width: 100%;
                    background: #1976d2;
                    color: white;
                    border: none;
                    padding: 10px;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                    margin-top: 12px;
                }
                .contact-btn:hover {
                    background: #1565c0;
                }
                .reviews-section {
                    grid-column: 1 / -1;
                    margin-top: 32px;
                }
                .review-form {
                    background: #f5f5f5;
                    padding: 16px;
                    border-radius: 8px;
                    margin-bottom: 24px;
                }
                .rating-input {
                    margin-bottom: 12px;
                }
                .stars {
                    display: flex;
                    gap: 4px;
                    font-size: 24px;
                    cursor: pointer;
                }
                .star {
                    cursor: pointer;
                    transition: transform 0.2s;
                }
                .star:hover,
                .star.active {
                    transform: scale(1.2);
                    color: #ffc107;
                }
                .review-textarea {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    resize: vertical;
                    min-height: 80px;
                    font-family: inherit;
                    margin-bottom: 12px;
                }
                .submit-btn {
                    background: #4caf50;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                }
                .submit-btn:hover {
                    background: #45a049;
                }
                .review-item {
                    background: white;
                    padding: 16px;
                    border-radius: 6px;
                    margin-bottom: 12px;
                    border: 1px solid #e0e0e0;
                }
                .reviewer-name {
                    font-weight: 600;
                    color: #333;
                }
                .reviewer-date {
                    font-size: 12px;
                    color: #999;
                }
                .review-rating {
                    color: #ffc107;
                    margin: 4px 0;
                }
                .review-comment {
                    color: #666;
                    margin-top: 8px;
                    line-height: 1.5;
                }
                @media (max-width: 768px) {
                    .content-grid {
                        grid-template-columns: 1fr;
                    }
                    .property-specs {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>

            <button className="close-btn" onClick={onClose}>×</button>

            <div className="detail-header">
                <h1 className="detail-title">{property.title}</h1>
                <div className="detail-meta">
                    <span>📍 {property.location?.address || 'N/A'}</span>
                    <span>📐 {property.area} sqm</span>
                    <span>🛏️ {property.bedrooms} Bed</span>
                    <span>🚿 {property.bathrooms} Bath</span>
                </div>
                <div style={{ marginTop: '12px' }}>
                    <span className="price-badge">฿{property.price.toLocaleString()}</span>
                    <span className="status-badge">{property.status.toUpperCase()}</span>
                </div>
            </div>

            {/* Gallery */}
            {property.images && property.images.length > 0 && (
                <div className="gallery">
                    <img
                        src={property.images[selectedImage]?.url}
                        alt="Property"
                        className="main-image"
                    />
                    {property.images.length > 1 && (
                        <div className="thumbnail-list">
                            {property.images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img.url}
                                    alt={`Thumbnail ${idx + 1}`}
                                    className={`thumbnail ${selectedImage === idx ? 'active' : ''}`}
                                    onClick={() => setSelectedImage(idx)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="content-grid">
                {/* Main Content */}
                <div>
                    <div className="section">
                        <h2 className="section-title">Description</h2>
                        <p className="description">{property.description}</p>
                    </div>

                    <div className="section">
                        <h2 className="section-title">Specifications</h2>
                        <div className="property-specs">
                            <div className="spec-item">
                                <div className="spec-label">Property Type</div>
                                <div className="spec-value">{property.propertyType}</div>
                            </div>
                            <div className="spec-item">
                                <div className="spec-label">Area</div>
                                <div className="spec-value">{property.area} sqm</div>
                            </div>
                            <div className="spec-item">
                                <div className="spec-label">Price per Unit</div>
                                <div className="spec-value">฿{property.pricePerUnit?.toLocaleString() || 'N/A'}</div>
                            </div>
                            <div className="spec-item">
                                <div className="spec-label">Views</div>
                                <div className="spec-value">{property.viewCount || 0}</div>
                            </div>
                        </div>
                    </div>

                    {(property.amenities?.length > 0 || property.features?.length > 0) && (
                        <div className="section">
                            <h2 className="section-title">Amenities & Features</h2>
                            <div className="tag-list">
                                {property.amenities?.map((amenity, idx) => (
                                    <span key={`a-${idx}`} className="tag">🏢 {amenity}</span>
                                ))}
                                {property.features?.map((feature, idx) => (
                                    <span key={`f-${idx}`} className="tag">✓ {feature}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {property.location && (
                        <div className="section">
                            <h2 className="section-title">Location Details</h2>
                            <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.8' }}>
                                <p>📍 {property.location.address}</p>
                                <p>🏙️ {property.location.district}, {property.location.province}</p>
                                <p>📮 {property.location.zipcode}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div>
                    <div className="owner-card">
                        <div className="owner-name">Contact Owner</div>
                        <div className="owner-detail">Name: {property.ownerName}</div>
                        <div className="owner-detail">Email: {property.ownerEmail}</div>
                        {property.ownerPhone && (
                            <div className="owner-detail">Phone: {property.ownerPhone}</div>
                        )}
                        {property.ownerId?.username && (
                            <button
                                className="contact-btn"
                                style={{ background: '#fff', color: '#1976d2', border: '1px solid #1976d2', marginTop: '8px' }}
                                onClick={() => navigate(`/profile/${property.ownerId.username}`)}
                            >
                                ดูโปรไฟล์ผู้โพสต์
                            </button>
                        )}
                        {showSendMessage ? (
                            <button className="contact-btn" onClick={handleStartChat} disabled={startingChat}>
                                {startingChat ? 'กำลังเปิดแชท...' : 'Send Message'}
                            </button>
                        ) : (
                            <button className="contact-btn" onClick={() => setShowSendMessage(true)}>Contact Now</button>
                        )}
                    </div>

                    {property.reviews && property.reviews.length > 0 && (
                        <div style={{ marginTop: '24px' }}>
                            <div className="spec-item">
                                <div className="spec-label">Average Rating</div>
                                <div className="spec-value">
                                    ⭐ {averageRating} ({property.reviews.length} reviews)
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Reviews Section */}
                <div className="reviews-section">
                    <h2 className="section-title">Reviews & Ratings</h2>

                    <div className="review-form">
                        <form onSubmit={handleAddReview}>
                            <div className="rating-input">
                                <label>Your Rating</label>
                                <div className="stars">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <span
                                            key={star}
                                            className={`star ${reviewRating >= star ? 'active' : ''}`}
                                            onClick={() => setReviewRating(star)}
                                        >
                                            ⭐
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <textarea
                                className="review-textarea"
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                placeholder="Share your experience with this property..."
                                disabled={submittingReview}
                            />

                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={submittingReview}
                                style={{ opacity: submittingReview ? 0.6 : 1, cursor: submittingReview ? 'not-allowed' : 'pointer' }}
                            >
                                {submittingReview ? 'Posting...' : 'Post Review'}
                            </button>
                        </form>
                    </div>

                    {error && (
                        <div style={{ background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>
                            {error}
                        </div>
                    )}

                    {property.reviews && property.reviews.length > 0 ? (
                        <div>
                            {property.reviews.map((review, idx) => (
                                <div key={idx} className="review-item">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                        <div>
                                            <div className="reviewer-name">{review.userName}</div>
                                            <div className="reviewer-date">
                                                {new Date(review.createdAt).toLocaleDateString('th-TH')}
                                            </div>
                                        </div>
                                        <div className="review-rating">
                                            {'⭐'.repeat(review.rating)}
                                        </div>
                                    </div>
                                    <div className="review-comment">{review.comment}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: '#999', textAlign: 'center', padding: '32px' }}>
                            No reviews yet. Be the first to review!
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
