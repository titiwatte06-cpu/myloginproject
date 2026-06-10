import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatPrice, mapProperty } from './pageData'
import { createProperty, updateProperty, deleteProperty, fetchProperties } from '../services/propertyApi'

const propertyTypes = ['ทั้งหมด', 'บ้านเดี่ยว', 'คอนโด', 'ทาวน์เฮาส์', 'ที่ดิน']

const modalOverlay = 'fixed inset-0 bg-black/50 flex justify-center items-center z-[1000]'
const modalCard = 'bg-white p-[30px] rounded-lg max-w-[500px] w-[90%] max-h-[90vh] overflow-y-auto'
const modalCardSmall = 'bg-white p-[30px] rounded-lg max-w-[400px] w-[90%]'
const formInput = 'w-full p-2 mb-2.5 rounded border border-[#ddd]'
const actionRow = 'flex gap-2.5 justify-end'
const cancelBtn = 'px-5 py-2.5 bg-[#999] text-white border-none rounded cursor-pointer'
const actionBtnBase = 'px-5 py-2.5 text-white border-none rounded'

function messageBox(msg) {
  return `p-2.5 mb-2.5 rounded text-center ${msg.includes('✓') ? 'bg-[#d4edda] text-[#155724]' : 'bg-[#f8d7da] text-[#721c24]'}`
}

export default function SearchPage() {
  const navigate = useNavigate()
  const [type, setType] = useState('ทั้งหมด')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedPropertyId, setSelectedPropertyId] = useState('')
  const [formData, setFormData] = useState({ title: '', location: '', price: '', type: '', beds: '', baths: '', area: '', image: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [properties, setProperties] = useState([])
  const [loadingProperties, setLoadingProperties] = useState(true)
  const [loadError, setLoadError] = useState('')

  const loadProperties = async () => {
    try {
      const data = await fetchProperties()
      setProperties((data.properties || []).map(mapProperty))
      setLoadError('')
    } catch (error) {
      setLoadError('ไม่สามารถโหลดข้อมูลที่พักอาศัยได้: ' + error.message)
    } finally {
      setLoadingProperties(false)
    }
  }

  useEffect(() => {
    loadProperties()
  }, [])

  const filteredProperties = useMemo(() => {
    const min = Number(minPrice) || 0
    const max = Number(maxPrice) || Infinity

    return properties.filter((property) => {
      const matchType = type === 'ทั้งหมด' || property.type === type
      return matchType && property.price >= min && property.price <= max
    })
  }, [properties, type, minPrice, maxPrice])

  // CRUD Handlers
  const handleCreate = async () => {
    if (!formData.title || !formData.location || !formData.price) {
      setMessage('กรุณากรอกข้อมูลให้ครบ')
      return
    }
    setLoading(true)
    try {
      await createProperty({
        title: formData.title,
        location: formData.location,
        price: Number(formData.price),
        type: formData.type || 'บ้านเดี่ยว',
        beds: Number(formData.beds) || 0,
        baths: Number(formData.baths) || 0,
        area: Number(formData.area) || 0,
        image: formData.image || 'https://via.placeholder.com/300x200'
      })
      setMessage('✓ เพิ่มที่พักอาศัยสำเร็จ')
      setFormData({ title: '', location: '', price: '', type: '', beds: '', baths: '', area: '', image: '' })
      loadProperties()
      setTimeout(() => setShowCreateModal(false), 1500)
    } catch (error) {
      setMessage('✗ เกิดข้อผิดพลาด: ' + error.message)
    }
    setLoading(false)
  }

  const handleUpdate = async () => {
    if (!selectedPropertyId) {
      setMessage('กรุณาระบุ ID ที่พักอาศัย')
      return
    }
    if (!formData.title || !formData.location || !formData.price) {
      setMessage('กรุณากรอกข้อมูลให้ครบ')
      return
    }
    setLoading(true)
    try {
      await updateProperty(selectedPropertyId, {
        title: formData.title,
        location: formData.location,
        price: Number(formData.price),
        type: formData.type || 'บ้านเดี่ยว',
        beds: Number(formData.beds) || 0,
        baths: Number(formData.baths) || 0,
        area: Number(formData.area) || 0,
        image: formData.image || 'https://via.placeholder.com/300x200'
      })
      setMessage('✓ อัปเดตที่พักอาศัยสำเร็จ')
      setFormData({ title: '', location: '', price: '', type: '', beds: '', baths: '', area: '', image: '' })
      setSelectedPropertyId('')
      loadProperties()
      setTimeout(() => setShowUpdateModal(false), 1500)
    } catch (error) {
      setMessage('✗ เกิดข้อผิดพลาด: ' + error.message)
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!selectedPropertyId) {
      setMessage('กรุณาระบุ ID ที่พักอาศัย')
      return
    }
    setLoading(true)
    try {
      await deleteProperty(selectedPropertyId)
      setMessage('✓ ลบที่พักอาศัยสำเร็จ')
      setSelectedPropertyId('')
      loadProperties()
      setTimeout(() => setShowDeleteModal(false), 1500)
    } catch (error) {
      setMessage('✗ เกิดข้อผิดพลาด: ' + error.message)
    }
    setLoading(false)
  }

  return (
    <section className="search-page">
      

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className={modalOverlay}>
          <div className={modalCard}>
            <h2>เพิ่มที่พักอาศัยใหม่</h2>
            <input
              type="text"
              placeholder="ชื่อ"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className={formInput}
            />
            <input
              type="text"
              placeholder="สถานที่"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className={formInput}
            />
            <input
              type="number"
              placeholder="ราคา"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              className={formInput}
            />
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className={formInput}
            >
              <option value="">เลือกประเภท</option>
              <option value="บ้านเดี่ยว">บ้านเดี่ยว</option>
              <option value="คอนโด">คอนโด</option>
              <option value="ทาวน์เฮาส์">ทาวน์เฮาส์</option>
            </select>
            <input
              type="number"
              placeholder="จำนวนห้องนอน"
              value={formData.beds}
              onChange={(e) => setFormData({...formData, beds: e.target.value})}
              className={formInput}
            />
            <input
              type="number"
              placeholder="จำนวนห้องน้ำ"
              value={formData.baths}
              onChange={(e) => setFormData({...formData, baths: e.target.value})}
              className={formInput}
            />
            <input
              type="number"
              placeholder="พื้นที่ (ตร.ม.)"
              value={formData.area}
              onChange={(e) => setFormData({...formData, area: e.target.value})}
              className={formInput}
            />
            <input
              type="text"
              placeholder="URL รูปภาพ"
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              className={formInput}
            />
            {message && (
              <div className={messageBox(message)}>
                {message}
              </div>
            )}
            <div className={actionRow}>
              <button
                onClick={() => { setShowCreateModal(false); setMessage(''); setFormData({ title: '', location: '', price: '', type: '', beds: '', baths: '', area: '', image: '' }); }}
                disabled={loading}
                className={cancelBtn}
              >
                ยกเลิก
              </button>
              <button
                onClick={handleCreate}
                disabled={loading}
                className={`${actionBtnBase} bg-[#4CAF50] ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {loading ? 'กำลังเพิ่ม...' : 'เพิ่ม'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPDATE MODAL */}
      {showUpdateModal && (
        <div className={modalOverlay}>
          <div className={modalCard}>
            <h2>อัปเดตที่พักอาศัย</h2>
            <input
              type="text"
              placeholder="ID ที่พักอาศัย"
              value={selectedPropertyId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
              className={formInput}
            />
            <input
              type="text"
              placeholder="ชื่อ"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className={formInput}
            />
            <input
              type="text"
              placeholder="สถานที่"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className={formInput}
            />
            <input
              type="number"
              placeholder="ราคา"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              className={formInput}
            />
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className={formInput}
            >
              <option value="">เลือกประเภท</option>
              <option value="บ้านเดี่ยว">บ้านเดี่ยว</option>
              <option value="คอนโด">คอนโด</option>
              <option value="ทาวน์เฮาส์">ทาวน์เฮาส์</option>
            </select>
            <input
              type="number"
              placeholder="จำนวนห้องนอน"
              value={formData.beds}
              onChange={(e) => setFormData({...formData, beds: e.target.value})}
              className={formInput}
            />
            <input
              type="number"
              placeholder="จำนวนห้องน้ำ"
              value={formData.baths}
              onChange={(e) => setFormData({...formData, baths: e.target.value})}
              className={formInput}
            />
            <input
              type="number"
              placeholder="พื้นที่ (ตร.ม.)"
              value={formData.area}
              onChange={(e) => setFormData({...formData, area: e.target.value})}
              className={formInput}
            />
            <input
              type="text"
              placeholder="URL รูปภาพ"
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              className={formInput}
            />
            {message && (
              <div className={messageBox(message)}>
                {message}
              </div>
            )}
            <div className={actionRow}>
              <button
                onClick={() => { setShowUpdateModal(false); setMessage(''); setFormData({ title: '', location: '', price: '', type: '', beds: '', baths: '', area: '', image: '' }); setSelectedPropertyId(''); }}
                disabled={loading}
                className={cancelBtn}
              >
                ยกเลิก
              </button>
              <button
                onClick={handleUpdate}
                disabled={loading}
                className={`${actionBtnBase} bg-[#2196F3] ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {loading ? 'กำลังอัปเดต...' : 'อัปเดต'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className={modalOverlay}>
          <div className={modalCardSmall}>
            <h2>ลบที่พักอาศัย</h2>
            <p>ป้อน ID ของที่พักอาศัยที่ต้องการลบ:</p>
            <input
              type="text"
              placeholder="ID ที่พักอาศัย"
              value={selectedPropertyId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
              className="w-full p-2 mb-5 rounded border border-[#ddd]"
            />
            {message && (
              <div className={messageBox(message)}>
                {message}
              </div>
            )}
            <div className={actionRow}>
              <button
                onClick={() => { setShowDeleteModal(false); setMessage(''); setSelectedPropertyId(''); }}
                disabled={loading}
                className={cancelBtn}
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className={`${actionBtnBase} bg-[#f44336] ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {loading ? 'กำลังลบ...' : 'ยืนยันลบ'}
              </button>
            </div>
          </div>
        </div>
      )}
      
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

      {loadError && (
        <div className={messageBox(loadError)}>{loadError}</div>
      )}

      {loadingProperties ? (
        <div className="empty-state">กำลังโหลดข้อมูล...</div>
      ) : (
        <>
          <div className="property-grid">
            {filteredProperties.map((property) => (
              <article className="property-card" key={property.id}>
                {property.ownerUsername && (
                  <button
                    type="button"
                    className="poster-row"
                    onClick={() => navigate(`/profile/${property.ownerUsername}`)}
                  >
                    <span className="poster-avatar">
                      {property.ownerAvatar
                        ? <img src={property.ownerAvatar} alt={property.ownerName} />
                        : <span>{property.ownerName.charAt(0)}</span>}
                    </span>
                    <span className="poster-name">{property.ownerName}</span>
                  </button>
                )}
                <div className="property-card-body" onClick={() => navigate(`/property/${property.id}`)}>
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
                </div>
              </article>
            ))}
          </div>

          {filteredProperties.length === 0 && (
            <div className="empty-state">ไม่พบรายการที่ตรงกับตัวกรอง ลองปรับช่วงราคาอีกครั้ง</div>
          )}
        </>
      )}
    </section>
  )
}

