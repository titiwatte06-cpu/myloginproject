import { useEffect, useState } from 'react'

const emptyProfile = {
  firstName: '',
  lastName: '',
  avatar: ''
}

const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').trim()


export default function ProfilePage({ username }) {
  const [profile, setProfile] = useState({ firstName: '', lastName: '', avatar: '' })
  const [status, setStatus] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('accessToken')
      const res = await fetch(`${apiUrl}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()

        if (data.username) {
          window.history.replaceState({}, '', `/profile/${data.username}`)
        }

        setProfile({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          avatar: data.avatar || ''
        })
      }
    }
    fetchProfile()
  }, [])

  function updateField(field, value) {
    setProfile((current) => ({ ...current, [field]: value }))
  }

  function uploadAvatar(event) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => updateField('avatar', reader.result)
    reader.readAsDataURL(file)
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

  return (
    <section className="profile-page">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Profile</span>
          <h1>ข้อมูลผู้ใช้</h1>
        </div>
        {status && <span className="save-status">{status}</span>}
      </div>

      <div className="profile-layout">
        <aside className="profile-preview">
          <div className="avatar-frame">
            {profile.avatar ? <img src={profile.avatar} alt="User avatar" /> : <span>{initials}</span>}
          </div>
          <h2>{profile.firstName || profile.lastName ? `${profile.firstName} ${profile.lastName}` : 'Your Name'}</h2>
          <p>Personal buyer dashboard</p>
        </aside>

        <form className="profile-form" onSubmit={saveProfile}>
          <label>
            Avatar
            <input type="file" accept="image/*" onChange={uploadAvatar} />
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
      </div>
    </section>
  )
}
