import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchUserProfile, fetchPropertiesByUsername } from '../services/propertyApi'
import { formatPrice, mapProperty } from './pageData'
import { apiUrl } from '../config/api.js'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { username } = useParams()
  const [profile, setProfile] = useState({ firstName: '', lastName: '', avatar: '', username: '' })
  const [status, setStatus] = useState('')
  const [avatarFileName, setAvatarFileName] = useState('')
  const [isOwner, setIsOwner] = useState(false)
  const [listings, setListings] = useState([])
  const [loadingListings, setLoadingListings] = useState(true)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      const token = localStorage.getItem('accessToken')
      let myData = null

      if (token) {
        const res = await fetch(`${apiUrl}/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) myData = await res.json()
      }

      if (cancelled) return

      if (!username) {
        if (myData) {
          setProfile({
            firstName: myData.firstName || '',
            lastName: myData.lastName || '',
            avatar: myData.avatar || '',
            username: myData.username || ''
          })
          setIsOwner(true)
          if (myData.username) navigate(`/profile/${myData.username}`, { replace: true })
        }
        return
      }

      const owner = myData?.username === username
      setIsOwner(owner)

      if (owner) {
        setProfile({
          firstName: myData.firstName || '',
          lastName: myData.lastName || '',
          avatar: myData.avatar || '',
          username: myData.username || ''
        })
        return
      }

      try {
        const data = await fetchUserProfile(username)
        if (cancelled) return
        setProfile({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          avatar: data.avatar || '',
          username: data.username || username
        })
      } catch {
        if (!cancelled) setProfile({ firstName: '', lastName: '', avatar: '', username })
      }
    }

    load()
    return () => { cancelled = true }
  }, [username, navigate])

  useEffect(() => {
    if (!username) return
    let cancelled = false
    setLoadingListings(true)
    fetchPropertiesByUsername(username)
      .then((data) => {
        if (!cancelled) setListings((data.properties || []).map(mapProperty))
      })
      .catch(() => {
        if (!cancelled) setListings([])
      })
      .finally(() => {
        if (!cancelled) setLoadingListings(false)
      })
    return () => { cancelled = true }
  }, [username])

  function updateField(field, value) {
    setProfile((current) => ({ ...current, [field]: value }))
  }

  async function uploadAvatar(event) {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('avatar', file)

    setStatus('กำลังอัปโหลดรูป...')
    try {
      const token = localStorage.getItem('accessToken')
      const res = await fetch(`${apiUrl}/profile/avatar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      })
      if (!res.ok) throw new Error('Upload failed')
      const updated = await res.json()
      updateField('avatar', updated.avatar || '')
      setAvatarFileName(file.name)
      setStatus('อัปโหลดรูปสำเร็จ')
      window.dispatchEvent(new CustomEvent('avatar-updated', { detail: { avatar: updated.avatar || '' } }))
    } catch {
      setStatus('อัปโหลดรูปไม่สำเร็จ')
    }
  }

  async function saveProfile(event) {
    event.preventDefault()
    const token = localStorage.getItem('accessToken')
    const res = await fetch(`${apiUrl}/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        firstName: profile.firstName,
        lastName: profile.lastName
      })
    })
    if (res.ok) setStatus('บันทึกข้อมูลแล้ว')
  }

  const initials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.trim() || 'E'
  const displayName = profile.firstName || profile.lastName ? `${profile.firstName} ${profile.lastName}`.trim() : (profile.username || 'Your Name')

  return (
    <section className="profile-page">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Profile</span>
          <h1>{isOwner ? 'ข้อมูลผู้ใช้' : `โปรไฟล์ของ ${displayName}`}</h1>
        </div>
        {status && <span className="save-status">{status}</span>}
      </div>

      <div className="profile-layout">
        <aside className="profile-preview">
          <div className="avatar-frame">
            {profile.avatar ? <img src={profile.avatar} alt="User avatar" /> : <span>{initials}</span>}
          </div>
          <h2>{displayName}</h2>
          <p>{isOwner ? 'Personal buyer dashboard' : `@${profile.username}`}</p>
        </aside>

        {isOwner ? (
          <form className="profile-form" onSubmit={saveProfile}>
            <label>
              Avatar
              <input type="file" accept="image/*" onChange={uploadAvatar} />
              {avatarFileName && <small className="avatar-filename">อัปโหลดแล้ว: {avatarFileName}</small>}
            </label>
            <label>
              ชื่อ
              <input value={profile.firstName} onChange={(event) => updateField('firstName', event.target.value)} placeholder="ชื่อ" />
            </label>
            <label>
              นามสกุล
              <input value={profile.lastName} onChange={(event) => updateField('lastName', event.target.value)} placeholder="นามสกุล" />
            </label>
            <button className="primary-action" type="submit">Save profile</button>
          </form>
        ) : (
          <div className="profile-form">
            <p>ดูประกาศทั้งหมดที่ {displayName} ลงไว้ และกดเข้าไปดูรายละเอียดของแต่ละประกาศได้</p>
          </div>
        )}
      </div>

      <div className="section-heading" style={{ marginTop: '24px' }}>
        <div>
          <span className="eyebrow">Listings</span>
          <h1>ประกาศที่ {displayName} ลงไว้</h1>
        </div>
        <span className="result-count">{listings.length} listings</span>
      </div>

      {loadingListings ? (
        <div className="empty-state">กำลังโหลดข้อมูล...</div>
      ) : listings.length === 0 ? (
        <div className="empty-state">ยังไม่มีประกาศ</div>
      ) : (
        <div className="property-grid">
          {listings.map((property) => (
            <article
              className="property-card"
              key={property.id}
              onClick={() => navigate(`/property/${property.id}`)}
              style={{ cursor: 'pointer' }}
            >
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
      )}
    </section>
  )
}
