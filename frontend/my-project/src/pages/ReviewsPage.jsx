import { useState } from 'react'
import { initialReviews } from './pageData'

const reviewStorageKey = 'estateReviews'

export default function ReviewsPage() {
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem(reviewStorageKey)
    return saved ? JSON.parse(saved) : initialReviews
  })
  const [form, setForm] = useState({ name: '', property: '', rating: '5', text: '' })

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function addReview(event) {
    event.preventDefault()
    if (!form.name.trim() || !form.property.trim() || !form.text.trim()) return

    const nextReviews = [
      {
        id: Date.now(),
        name: form.name.trim(),
        property: form.property.trim(),
        rating: Number(form.rating),
        text: form.text.trim()
      },
      ...reviews
    ]

    setReviews(nextReviews)
    localStorage.setItem(reviewStorageKey, JSON.stringify(nextReviews))
    setForm({ name: '', property: '', rating: '5', text: '' })
  }

  return (
    <section className="reviews-page">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Reviews</span>
          <h1>รีวิวบ้านจากผู้ใช้งาน</h1>
        </div>
      </div>

      <div className="reviews-layout">
        <form className="review-form" onSubmit={addReview}>
          <h2>เพิ่มรีวิวใหม่</h2>
          <label>
            ชื่อ
            <input value={form.name} onChange={(event) => updateForm('name', event.target.value)} placeholder="Your name" />
          </label>
          <label>
            บ้าน / โครงการ
            <input value={form.property} onChange={(event) => updateForm('property', event.target.value)} placeholder="Property name" />
          </label>
          <label>
            Rating
            <select value={form.rating} onChange={(event) => updateForm('rating', event.target.value)}>
              {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating}</option>)}
            </select>
          </label>
          <label>
            Review
            <textarea value={form.text} onChange={(event) => updateForm('text', event.target.value)} placeholder="เล่าประสบการณ์ของคุณ" rows="5" />
          </label>
          <button className="primary-action" type="submit">Add review</button>
        </form>

        <div className="review-list">
          {reviews.map((review) => (
            <article className="review-card" key={review.id}>
              <div>
                <strong>{review.name}</strong>
                <span>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
              </div>
              <h3>{review.property}</h3>
              <p>{review.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
