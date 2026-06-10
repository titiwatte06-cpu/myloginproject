import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatPrice } from './pageData'
import { fetchProperties } from '../services/propertyApi'

const typeLabels = { House: 'บ้านเดี่ยว', Condo: 'คอนโด', Townhouse: 'ทาวน์เฮาส์', Land: 'ที่ดิน' }
const placeholderImage = 'https://via.placeholder.com/300x200'

function mapProperty(property) {
  return {
    id: property._id,
    title: property.title,
    type: typeLabels[property.propertyType] || property.propertyType,
    price: property.price,
    image: property.images?.[0]?.url || placeholderImage
  }
}

export default function HomePage() {
  const navigate = useNavigate()
  const [featured, setFeatured] = useState([])
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    fetchProperties()
      .then((data) => {
        const all = data.properties || []
        setTotalCount(all.length)
        setFeatured(all.slice(0, 3).map(mapProperty))
      })
      .catch((error) => console.error('Error fetching properties:', error))
  }, [])

  return (
    <section className="home-page">
      <div className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">Curated real estate</span>
          <h1>Find a home that feels calm, sharp, and ready for real life.</h1>
          <p>สำรวจบ้าน คอนโด และทาวน์เฮาส์ที่คัดมาให้เหมาะกับชีวิตเมืองยุคใหม่ พร้อมแดชบอร์ดที่ใช้งานง่ายหลังเข้าสู่ระบบ</p>
          <div className="hero-actions">
            <button className="primary-action" onClick={() => navigate('/search')}>Search properties</button>
            <button className="secondary-action" onClick={() => navigate('/reviews')}>Read reviews</button>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1100&q=80" alt="Modern living room" />
          <div className="hero-stat">
            <strong>{totalCount}+</strong>
            <span>Selected homes</span>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <article>
          <strong>42M</strong>
          <span>Total listing value</span>
        </article>
        <article>
          <strong>3</strong>
          <span>Property types</span>
        </article>
        <article>
          <strong>4.7</strong>
          <span>Average review score</span>
        </article>
      </div>

      <div className="section-heading">
        <div>
          <span className="eyebrow">Featured</span>
          <h2>Recommended homes</h2>
        </div>
        <button className="text-action" onClick={() => navigate('/search')}>View all</button>
      </div>

      <div className="property-grid compact">
        {featured.map((property) => (
          <article className="property-card" key={property.id}>
            <img src={property.image} alt={property.title} />
            <div>
              <span className="pill">{property.type}</span>
              <h3>{property.title}</h3>
              <p>{property.location}</p>
              <strong>{formatPrice(property.price)}</strong>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
