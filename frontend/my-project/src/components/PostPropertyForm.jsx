import { useState } from 'react';
import { createProperty, updateProperty } from '../services/propertyApi';

export default function PostPropertyForm({ property, onSuccess, onCancel }) {
    const [formData, setFormData] = useState(property || {
        title: '',
        description: '',
        price: '',
        pricePerUnit: '',
        area: '',
        propertyType: 'House',
        bedrooms: '',
        bathrooms: '',
        location: {
            address: '',
            district: '',
            province: '',
            zipcode: ''
        },
        images: [],
        amenities: [],
        features: [],
        ownerPhone: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [amenityInput, setAmenityInput] = useState('');
    const [featureInput, setFeatureInput] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('location.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                location: { ...prev.location, [field]: value }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleAddAmenity = () => {
        if (amenityInput.trim()) {
            setFormData(prev => ({
                ...prev,
                amenities: [...prev.amenities, amenityInput.trim()]
            }));
            setAmenityInput('');
        }
    };

    const handleRemoveAmenity = (index) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.filter((_, i) => i !== index)
        }));
    };

    const handleAddFeature = () => {
        if (featureInput.trim()) {
            setFormData(prev => ({
                ...prev,
                features: [...prev.features, featureInput.trim()]
            }));
            setFeatureInput('');
        }
    };

    const handleRemoveFeature = (index) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    const handleAddImage = () => {
        if (imageUrl.trim()) {
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, { url: imageUrl.trim(), alt: formData.title }]
            }));
            setImageUrl('');
        }
    };

    const handleRemoveImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validate required fields
            if (!formData.title || !formData.description || !formData.price || !formData.area) {
                setError('Please fill in all required fields');
                setLoading(false);
                return;
            }

            const submitData = {
                ...formData,
                price: parseFloat(formData.price),
                pricePerUnit: formData.pricePerUnit ? parseFloat(formData.pricePerUnit) : 0,
                area: parseFloat(formData.area),
                bedrooms: parseInt(formData.bedrooms) || 0,
                bathrooms: parseInt(formData.bathrooms) || 0
            };

            if (property?._id) {
                await updateProperty(property._id, submitData);
            } else {
                await createProperty(submitData);
            }

            onSuccess?.();
        } catch (err) {
            setError(err.message || 'Failed to save property');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="post-property-form">
            <style>{`
                .post-property-form {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 32px 16px;
                    background: #f5f5f5;
                    border-radius: 12px;
                }
                .form-section {
                    background: white;
                    padding: 24px;
                    margin-bottom: 16px;
                    border-radius: 8px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                .section-title {
                    font-size: 18px;
                    font-weight: 600;
                    margin-bottom: 16px;
                    color: #333;
                }
                .form-group {
                    margin-bottom: 16px;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 500;
                    color: #555;
                }
                .form-group input,
                .form-group textarea,
                .form-group select {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    font-family: inherit;
                    font-size: 14px;
                }
                .form-group textarea {
                    resize: vertical;
                    min-height: 100px;
                }
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                }
                @media (max-width: 600px) {
                    .form-row {
                        grid-template-columns: 1fr;
                    }
                }
                .tag-container {
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
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 13px;
                }
                .tag button {
                    background: none;
                    border: none;
                    color: #1976d2;
                    cursor: pointer;
                    font-size: 16px;
                    padding: 0;
                }
                .add-btn {
                    background: #f0f0f0;
                    border: 1px solid #ddd;
                    padding: 10px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 500;
                    margin-top: 8px;
                }
                .add-btn:hover {
                    background: #e8e8e8;
                }
                .input-add-row {
                    display: flex;
                    gap: 8px;
                }
                .input-add-row input {
                    flex: 1;
                }
                .image-preview {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
                    gap: 12px;
                    margin-top: 12px;
                }
                .image-item {
                    position: relative;
                    border-radius: 6px;
                    overflow: hidden;
                }
                .image-item img {
                    width: 100%;
                    height: 100px;
                    object-fit: cover;
                }
                .image-item button {
                    position: absolute;
                    top: 4px;
                    right: 4px;
                    background: rgba(255,0,0,0.7);
                    color: white;
                    border: none;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 12px;
                }
                .button-group {
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                    margin-top: 24px;
                }
                .btn {
                    padding: 12px 24px;
                    border-radius: 6px;
                    border: none;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .btn-primary {
                    background: #1976d2;
                    color: white;
                }
                .btn-primary:hover {
                    background: #1565c0;
                }
                .btn-secondary {
                    background: #e0e0e0;
                    color: #333;
                }
                .btn-secondary:hover {
                    background: #d0d0d0;
                }
                .error {
                    background: #ffebee;
                    color: #c62828;
                    padding: 12px;
                    border-radius: 6px;
                    margin-bottom: 16px;
                }
                .loading {
                    opacity: 0.6;
                    pointer-events: none;
                }
            `}</style>

            <h1>Post a Property</h1>

            {error && <div className="error">{error}</div>}

            <form onSubmit={handleSubmit}>
                {/* Basic Information */}
                <div className="form-section">
                    <h2 className="section-title">Basic Information</h2>
                    
                    <div className="form-group">
                        <label>Property Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="e.g., Modern 3BR House in Sukhumvit"
                        />
                    </div>

                    <div className="form-group">
                        <label>Description *</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Describe your property in detail..."
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Property Type *</label>
                            <select
                                name="propertyType"
                                value={formData.propertyType}
                                onChange={handleInputChange}
                            >
                                <option value="House">House</option>
                                <option value="Condo">Condo</option>
                                <option value="Townhouse">Townhouse</option>
                                <option value="Land">Land</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                name="ownerPhone"
                                value={formData.ownerPhone}
                                onChange={handleInputChange}
                                placeholder="Contact phone number"
                            />
                        </div>
                    </div>
                </div>

                {/* Pricing & Size */}
                <div className="form-section">
                    <h2 className="section-title">Pricing & Size</h2>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label>Price (THB) *</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                placeholder="3,500,000"
                            />
                        </div>
                        <div className="form-group">
                            <label>Price per Unit (THB/sqm)</label>
                            <input
                                type="number"
                                name="pricePerUnit"
                                value={formData.pricePerUnit}
                                onChange={handleInputChange}
                                placeholder="50,000"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Area (sqm) *</label>
                            <input
                                type="number"
                                name="area"
                                value={formData.area}
                                onChange={handleInputChange}
                                placeholder="120"
                            />
                        </div>
                        <div className="form-group">
                            <label>Bedrooms</label>
                            <input
                                type="number"
                                name="bedrooms"
                                value={formData.bedrooms}
                                onChange={handleInputChange}
                                placeholder="3"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Bathrooms</label>
                        <input
                            type="number"
                            name="bathrooms"
                            value={formData.bathrooms}
                            onChange={handleInputChange}
                            placeholder="2"
                        />
                    </div>
                </div>

                {/* Location */}
                <div className="form-section">
                    <h2 className="section-title">Location</h2>
                    
                    <div className="form-group">
                        <label>Address</label>
                        <input
                            type="text"
                            name="location.address"
                            value={formData.location.address}
                            onChange={handleInputChange}
                            placeholder="123 Sukhumvit Road"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>District</label>
                            <input
                                type="text"
                                name="location.district"
                                value={formData.location.district}
                                onChange={handleInputChange}
                                placeholder="Prakanong"
                            />
                        </div>
                        <div className="form-group">
                            <label>Province</label>
                            <input
                                type="text"
                                name="location.province"
                                value={formData.location.province}
                                onChange={handleInputChange}
                                placeholder="Bangkok"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Zipcode</label>
                        <input
                            type="text"
                            name="location.zipcode"
                            value={formData.location.zipcode}
                            onChange={handleInputChange}
                            placeholder="10110"
                        />
                    </div>
                </div>

                {/* Images */}
                <div className="form-section">
                    <h2 className="section-title">Property Images</h2>
                    
                    <div className="input-add-row">
                        <input
                            type="url"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="Enter image URL"
                        />
                        <button type="button" className="add-btn" onClick={handleAddImage}>
                            Add Image
                        </button>
                    </div>

                    {formData.images && formData.images.length > 0 && (
                        <div className="image-preview">
                            {formData.images.map((img, idx) => (
                                <div key={idx} className="image-item">
                                    <img src={img.url} alt={img.alt} />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(idx)}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Amenities */}
                <div className="form-section">
                    <h2 className="section-title">Amenities</h2>
                    
                    <div className="input-add-row">
                        <input
                            type="text"
                            value={amenityInput}
                            onChange={(e) => setAmenityInput(e.target.value)}
                            placeholder="e.g., Swimming Pool, Gym, Security"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAmenity())}
                        />
                        <button type="button" className="add-btn" onClick={handleAddAmenity}>
                            Add
                        </button>
                    </div>

                    {formData.amenities && formData.amenities.length > 0 && (
                        <div className="tag-container">
                            {formData.amenities.map((amenity, idx) => (
                                <div key={idx} className="tag">
                                    {amenity}
                                    <button type="button" onClick={() => handleRemoveAmenity(idx)}>×</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Features */}
                <div className="form-section">
                    <h2 className="section-title">Features</h2>
                    
                    <div className="input-add-row">
                        <input
                            type="text"
                            value={featureInput}
                            onChange={(e) => setFeatureInput(e.target.value)}
                            placeholder="e.g., Near BTS, Ready to Move"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                        />
                        <button type="button" className="add-btn" onClick={handleAddFeature}>
                            Add
                        </button>
                    </div>

                    {formData.features && formData.features.length > 0 && (
                        <div className="tag-container">
                            {formData.features.map((feature, idx) => (
                                <div key={idx} className="tag">
                                    {feature}
                                    <button type="button" onClick={() => handleRemoveFeature(idx)}>×</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="button-group">
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                    >
                        {loading ? 'Saving...' : (property?._id ? 'Update Property' : 'Post Property')}
                    </button>
                </div>
            </form>
        </div>
    );
}
