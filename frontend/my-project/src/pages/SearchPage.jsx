import { useMemo, useState } from 'react'
import { properties, formatPrice } from './pageData'

const propertyTypes = ['ทั้งหมด', 'บ้านเดี่ยว', 'คอนโด', 'ทาวน์เฮาส์']

export default function SearchPage() {
  const [type, setType] = useState('ทั้งหมด')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const filteredProperties = useMemo(() => {
    const min = Number(minPrice) || 0
    const max = Number(maxPrice) || Infinity

    return properties.filter((property) => {
      const matchType = type === 'ทั้งหมด' || property.type === type
      return matchType && property.price >= min && property.price <= max
    })
  }, [type, minPrice, maxPrice])

  return (
    <section className="search-page">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Property search</span>
          <h1>ค้นหาบ้านที่ตรงงบและสไตล์</h1>
        </div>
        <span className="result-count">{filteredProperties.length} listings</span>
      </div>

      <div className="filter-bar">
        <label>
          ประเภทบ้าน
          <select value={type} onChange={(event) => setType(event.target.value)}>
            {propertyTypes.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label>
          ราคาต่ำสุด
          <input type="number" min="0" placeholder="0" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} />
        </label>
        <label>
          ราคาสูงสุด
          <input type="number" min="0" placeholder="20000000" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} />
        </label>
        <button className="secondary-action" onClick={() => {
          setType('ทั้งหมด')
          setMinPrice('')
          setMaxPrice('')
        }}>
          Reset
        </button>
      </div>

      <div className="property-grid">
        {filteredProperties.map((property) => (
          <article className="property-card" key={property.id}>
            <img src={property.image} alt={property.title} />
            <div>
              <span className="pill">{property.type}</span>
              <h3>{property.title}</h3>
              <p>{property.location}</p>
              <div className="property-meta">
                <span>{property.beds} beds</span>
                <span>{property.baths} baths</span>
                <span>{property.area} sqm</span>
              </div>
              <strong>{formatPrice(property.price)}</strong>
            </div>
          </article>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="empty-state">ไม่พบรายการที่ตรงกับตัวกรอง ลองปรับช่วงราคาอีกครั้ง</div>
      )}
    </section>
  )
}
