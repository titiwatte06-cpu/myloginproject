import { useState } from 'react';
import PostPropertyForm from './PostPropertyForm';
import MyListings from './MyListings';
import PropertyDetail from './PropertyDetail';

export default function PropertyManagement() {
    const [view, setView] = useState('listings'); // 'listings', 'post', 'edit', 'detail'
    const [selectedProperty, setSelectedProperty] = useState(null);

    const handlePostNew = () => {
        setSelectedProperty(null);
        setView('post');
    };

    const handleEditProperty = (property) => {
        setSelectedProperty(property);
        setView('edit');
    };

    const handleViewProperty = (property) => {
        setSelectedProperty(property);
        setView('detail');
    };

    const handleSuccess = () => {
        setView('listings');
        setSelectedProperty(null);
    };

    const handleCancel = () => {
        setView('listings');
        setSelectedProperty(null);
    };

    const handleBackToListings = () => {
        setView('listings');
        setSelectedProperty(null);
    };

    return (
        <div className="property-management">
            <style>{`
                .property-management {
                    min-height: 100vh;
                    background: #f5f5f5;
                }
                .breadcrumb {
                    padding: 16px 32px;
                    background: white;
                    border-bottom: 1px solid #e0e0e0;
                    display: flex;
                    gap: 12px;
                    align-items: center;
                    margin-bottom: 24px;
                }
                .breadcrumb-item {
                    color: #666;
                    font-size: 14px;
                    cursor: pointer;
                    transition: color 0.3s;
                }
                .breadcrumb-item:hover,
                .breadcrumb-item.active {
                    color: #1976d2;
                    font-weight: 500;
                }
                .breadcrumb-sep {
                    color: #ccc;
                }
            `}</style>

            {/* Breadcrumb Navigation */}
            {view !== 'listings' && (
                <div className="breadcrumb">
                    <span
                        className="breadcrumb-item"
                        onClick={handleBackToListings}
                    >
                        ← Back to Listings
                    </span>
                    <span className="breadcrumb-sep">|</span>
                    <span className="breadcrumb-item active">
                        {view === 'post' && '📝 Post New Property'}
                        {view === 'edit' && '✏️ Edit Property'}
                        {view === 'detail' && '👁️ Property Details'}
                    </span>
                </div>
            )}

            {/* Listings View - Default */}
            {view === 'listings' && (
                <MyListings
                    onEditProperty={handleEditProperty}
                    onPostNew={handlePostNew}
                    onViewProperty={handleViewProperty}
                />
            )}

            {/* Post/Edit View */}
            {(view === 'post' || view === 'edit') && (
                <PostPropertyForm
                    property={selectedProperty}
                    onSuccess={handleSuccess}
                    onCancel={handleCancel}
                />
            )}

            {/* Detail View */}
            {view === 'detail' && selectedProperty && (
                <PropertyDetail
                    propertyId={selectedProperty._id}
                    onClose={handleBackToListings}
                />
            )}
        </div>
    );
}
