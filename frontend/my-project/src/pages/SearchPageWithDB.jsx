import { useState, useEffect } from 'react';
import { fetchProperties } from '../services/propertyApi';
import PropertyDetail from '../components/PropertyDetail';

function formatPrice(price) {
    return price.toLocaleString('th-TH');
}

export default function SearchPageWithDB({ setRoute }) {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [showDetail, setShowDetail] = useState(false);

    // Filter states
    const [propertyType, setPropertyType] = useState('all');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortBy, setSortBy] = useState('featured');

    useEffect(() => {
        loadProperties();
    }, [propertyType, minPrice, maxPrice, sortBy]);

    const loadProperties = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await fetchProperties({
                propertyType: propertyType !== 'all' ? propertyType : undefined,
                minPrice: minPrice || undefined,
                maxPrice: maxPrice || undefined,
                sortBy: sortBy
            });
            setProperties(data.properties || []);
        } catch (err) {
            setError('Failed to load properties');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setPropertyType('all');
        setMinPrice('');
        setMaxPrice('');
        setSortBy('featured');
    };

    const handleViewProperty = (property) => {
        setSelectedProperty(property);
        setShowDetail(true);
    };

    if (showDetail && selectedProperty) {
        return (
            <PropertyDetail
                propertyId={selectedProperty._id}
                onClose={() => setShowDetail(false)}
            />
        );
    }

    return (
        <section className="search-page-db">
            <style>{`
                .search-page-db {
                    background: white;
                    padding: 40px 32px;
                    max-width: 1400px;
                    margin: 0 auto;
                }
                .search-heading {
                    margin-bottom: 32px;
                }
                .search-title {
                    font-size: 28px;
                    font-weight: 700;
                    margin: 0 0 8px 0;
                    color: #333;
                }
                .search-subtitle {
                    font-size: 14px;
                    color: #999;
                    margin: 0;
                }
                .results-count {
                    font-size: 14px;
                    color: #666;
                    margin-top: 16px;
                }
                .filters-section {
                    background: #f9f9f9;
                    border-radius: 8px;
                    padding: 24px;
                    margin-bottom: 32px;
                }
                .filters-title {
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 16px;
                    color: #333;
                }
                .filters-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 16px;
                    margin-bottom: 16px;
                }
                .filter-group {
                    display: flex;
                    flex-direction: column;
                }
                .filter-label {
                    font-size: 12px;
                    font-weight: 600;
                    color: #666;
                    text-transform: uppercase;
                    margin-bottom: 6px;
                }
                .filter-input,
                .filter-select {
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    font-size: 14px;
                    background: white;
                }
                .filter-input:focus,
                .filter-select:focus {
                    outline: none;
                    border-color: #1976d2;
                    box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
                }
                .filter-actions {
                    display: flex;
                    gap: 8px;
                    justify-content: flex-end;
                }
                .btn-reset {
                    background: #e0e0e0;
                    color: #333;
                    border: none;
                    padding: 10px 24px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: background 0.3s;
                }
                .btn-reset:hover {
                    background: #d0d0d0;
                }
                .properties-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 24px;
                    margin-bottom: 32px;
                }
                .property-card {
                    background: white;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    cursor: pointer;
                }
                .property-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
                }
                .property-image {
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                    background: #e0e0e0;
                }
                .property-card-content {
                    padding: 16px;
                }
                .property-type {
                    font-size: 11px;
                    color: #1976d2;
                    font-weight: 700;
                    text-transform: uppercase;
                    margin-bottom: 6px;
                }
                .property-title {
                    font-size: 16px;
                    font-weight: 600;
                    margin: 0 0 8px 0;
                    color: #333;
                }
                .property-location {
                    font-size: 13px;
                    color: #666;
                    margin-bottom: 12px;
                }
                .property-specs {
                    display: flex;
                    justify-content: space-between;
                    font-size: 12px;
                    color: #999;
                    margin-bottom: 12px;
                    padding-bottom: 12px;
                    border-bottom: 1px solid #e0e0e0;
                }
                .property-price {
                    font-size: 18px;
                    font-weight: 700;
                    color: #1976d2;
                }
                .loading-state,
                .error-state,
                .empty-state {
                    text-align: center;
                    padding: 48px 16px;
                    color: #666;
                }
                .error-state {
                    background: #ffebee;
                    color: #c62828;
                    border-radius: 8px;
                    padding: 24px;
                }
                @media (max-width: 768px) {
                    .search-page-db {
                        padding: 24px 16px;
                    }
                    .filters-grid {
                        grid-template-columns: 1fr;
                    }
                    .search-title {
                        font-size: 22px;
                    }
                }
            `}</style>

            {/* Header */}
            <div className="search-heading">
                <h1 className="search-title">Property Search</h1>
                <p className="search-subtitle">Find your perfect home from our collection</p>
                {properties.length > 0 && (
                    <p className="results-count">
                        Found {properties.length} propert{properties.length !== 1 ? 'ies' : 'y'}
                    </p>
                )}
            </div>

            {/* Filters */}
            <div className="filters-section">
                <h3 className="filters-title">Search Filters</h3>
                <div className="filters-grid">
                    <div className="filter-group">
                        <label className="filter-label">Property Type</label>
                        <select
                            className="filter-select"
                            value={propertyType}
                            onChange={(e) => setPropertyType(e.target.value)}
                        >
                            <option value="all">All Types</option>
                            <option value="House">House</option>
                            <option value="Condo">Condo</option>
                            <option value="Townhouse">Townhouse</option>
                            <option value="Land">Land</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Min Price (฿)</label>
                        <input
                            type="number"
                            className="filter-input"
                            placeholder="0"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Max Price (฿)</label>
                        <input
                            type="number"
                            className="filter-input"
                            placeholder="No limit"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Sort By</label>
                        <select
                            className="filter-select"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="featured">Featured</option>
                            <option value="newest">Newest</option>
                            <option value="priceLow">Price: Low to High</option>
                            <option value="priceHigh">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                <div className="filter-actions">
                    <button className="btn-reset" onClick={handleReset}>
                        Reset Filters
                    </button>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="error-state">
                    {error}
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="loading-state">
                    <p>Loading properties...</p>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && properties.length === 0 && (
                <div className="empty-state">
                    <p>No properties found matching your criteria.</p>
                    <p>Try adjusting your filters.</p>
                </div>
            )}

            {/* Properties Grid */}
            {!loading && !error && properties.length > 0 && (
                <div className="properties-grid">
                    {properties.map((property) => (
                        <div
                            key={property._id}
                            className="property-card"
                            onClick={() => handleViewProperty(property)}
                        >
                            {property.images && property.images[0] ? (
                                <img
                                    src={property.images[0].url}
                                    alt={property.title}
                                    className="property-image"
                                />
                            ) : (
                                <div className="property-image" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#999'
                                }}>
                                    No Image
                                </div>
                            )}

                            <div className="property-card-content">
                                <p className="property-type">{property.propertyType}</p>
                                <h3 className="property-title">{property.title}</h3>
                                <p className="property-location">
                                    📍 {property.location?.district || 'N/A'}, {property.location?.province || 'N/A'}
                                </p>

                                <div className="property-specs">
                                    <span>🛏️ {property.bedrooms} BR</span>
                                    <span>🚿 {property.bathrooms} BA</span>
                                    <span>📐 {property.area} sqm</span>
                                </div>

                                <div className="property-price">
                                    ฿{formatPrice(property.price)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
