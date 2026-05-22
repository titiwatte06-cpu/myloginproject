import { useEffect, useState } from 'react'

const emptyProfile = {
  firstName: '',
  lastName: '',
  avatar: ''
}

export default function ProfilePage() {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('estateProfile')
    return saved ? JSON.parse(saved) : emptyProfile
  })
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (!status) return undefined
    const timer = window.setTimeout(() => setStatus(''), 1800)
    return () => window.clearTimeout(timer)
  }, [status])

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

  function saveProfile(event) {
    event.preventDefault()
    localStorage.setItem('estateProfile', JSON.stringify(profile))
    setStatus('บันทึกข้อมูลแล้ว')
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
