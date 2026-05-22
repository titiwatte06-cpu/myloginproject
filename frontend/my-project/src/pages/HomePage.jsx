import { properties, formatPrice } from './pageData'

function navigate(path, setRoute) {
  window.history.pushState({}, '', path)
  setRoute(path)
}

export default function HomePage({ setRoute }) {
  const featured = properties.slice(0, 3)

  return (
    <section className="home-page">
      <div className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">Curated real estate</span>
          <h1>Find a home that feels calm, sharp, and ready for real life.</h1>
          <p>สำรวจบ้าน คอนโด และทาวน์เฮาส์ที่คัดมาให้เหมาะกับชีวิตเมืองยุคใหม่ พร้อมแดชบอร์ดที่ใช้งานง่ายหลังเข้าสู่ระบบ</p>
          <div className="hero-actions">
            <button className="primary-action" onClick={() => navigate('/search', setRoute)}>Search properties</button>
            <button className="secondary-action" onClick={() => navigate('/reviews', setRoute)}>Read reviews</button>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1100&q=80" alt="Modern living room" />
          <div className="hero-stat">
            <strong>6+</strong>
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
        <button className="text-action" onClick={() => navigate('/search', setRoute)}>View all</button>
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
