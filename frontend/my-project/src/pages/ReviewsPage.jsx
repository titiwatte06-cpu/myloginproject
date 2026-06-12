import { useEffect, useState } from 'react'
import { fetchProperties, fetchPropertyById, addReview } from '../services/propertyApi'

export default function ReviewsPage() {
  const [properties, setProperties] = useState([])
  const [loadingProperties, setLoadingProperties] = useState(true)
  const [selectedPropertyId, setSelectedPropertyId] = useState('')
  const [reviews, setReviews] = useState([])
  const [loadingReviews, setLoadingReviews] = useState(false)
  const [form, setForm] = useState({ rating: '5', comment: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    fetchProperties()
      .then((data) => {
        if (cancelled) return
        const list = data.properties || []
        setProperties(list)
        if (list.length > 0) setSelectedPropertyId(list[0]._id)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoadingProperties(false)
      })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!selectedPropertyId) return

    let cancelled = false
    setLoadingReviews(true)
    fetchPropertyById(selectedPropertyId)
      .then((data) => {
        if (!cancelled) setReviews(data.property?.reviews || [])
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoadingReviews(false)
      })
    return () => { cancelled = true }
  }, [selectedPropertyId])

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleAddReview(event) {
    event.preventDefault()
    if (!selectedPropertyId || !form.comment.trim()) return

    setSubmitting(true)
    setError('')

    try {
      const data = await addReview(selectedPropertyId, {
        rating: Number(form.rating),
        comment: form.comment.trim()
      })
      setReviews(data.property?.reviews || [])
      setForm({ rating: '5', comment: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const selectedProperty = properties.find((p) => p._id === selectedPropertyId)

  return (
    <section className="reviews-page">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Reviews</span>
          <h1>รีวิวบ้านจากผู้ใช้งาน</h1>
        </div>
      </div>

      <div className="reviews-layout">
        <form className="review-form" onSubmit={handleAddReview}>
          <h2>เพิ่มรีวิวใหม่</h2>
          <label>
            บ้าน / โครงการ
            {loadingProperties ? (
              <select disabled><option>กำลังโหลด...</option></select>
            ) : properties.length === 0 ? (
              <select disabled><option>ยังไม่มีประกาศ</option></select>
            ) : (
              <select value={selectedPropertyId} onChange={(event) => setSelectedPropertyId(event.target.value)}>
                {properties.map((property) => (
                  <option key={property._id} value={property._id}>{property.title}</option>
                ))}
              </select>
            )}
          </label>
          <label>
            Rating
            <select value={form.rating} onChange={(event) => updateForm('rating', event.target.value)}>
              {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating}</option>)}
            </select>
          </label>
          <label>
            Review
            <textarea value={form.comment} onChange={(event) => updateForm('comment', event.target.value)} placeholder="เล่าประสบการณ์ของคุณ" rows="5" />
          </label>
          {error && <div className="empty-state">{error}</div>}
          <button className="primary-action" type="submit" disabled={submitting || !selectedPropertyId}>
            {submitting ? 'กำลังส่ง...' : 'Add review'}
          </button>
        </form>

        <div className="review-list">
          {loadingReviews ? (
            <div className="empty-state">กำลังโหลดรีวิว...</div>
          ) : reviews.length === 0 ? (
            <div className="empty-state">ยังไม่มีรีวิวสำหรับประกาศนี้</div>
          ) : (
            [...reviews].reverse().map((review) => (
              <article className="review-card" key={review._id}>
                <div>
                  <strong>{review.userName}</strong>
                  <span>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                </div>
                <h3>{selectedProperty?.title}</h3>
                <p>{review.comment}</p>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
