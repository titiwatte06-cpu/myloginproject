import { useState } from 'react'
import { Logo } from '../icon/Icon.jsx';
import { apiUrl } from '../config/api.js'
import { validatePassword } from '../utils/validators.js'
import { navigate } from '../utils/routing.js'

export default function ChangePasswordPage({ setRoute }) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  async function submit() {
    setStatus(null)

    if (validatePassword(newPassword)) {
      setStatus({ type: 'bad', text: validatePassword(newPassword) })
      return
    }

    if (newPassword !== confirmPassword) {
      setStatus({ type: 'bad', text: 'New passwords do not match' })
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem('accessToken')
      const res = await fetch(`${apiUrl}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: 'include',
        body: JSON.stringify({ currentPassword, newPassword })
      })
      const data = await res.json()

      if (!res.ok) {
        setStatus({ type: 'bad', text: data.message || 'Cannot change password' })
        return
      }

      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setStatus({ type: 'ok', text: data.message || 'Password changed successfully' })
    } catch {
      setStatus({ type: 'bad', text: 'Cannot connect to server' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-card">
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <Logo />
      </div>

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', margin: 0, marginBottom: 4 }}>
          Change password
        </h1>
        <p style={{ fontSize: 13.5, color: '#777', margin: 0 }}>
          Update your account password
        </p>
      </div>

      {status && <div className={`status ${status.type}`}>{status.text}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 18 }}>
        <div className="field-wrap">
          <label className="field-label">Current password</label>
          <input
            className="field-input"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>

        <div className="field-wrap">
          <label className="field-label">New password</label>
          <input
            className="field-input"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="field-wrap">
          <label className="field-label">Confirm new password</label>
          <input
            className="field-input"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>

      <button className="btn-primary" style={{ marginBottom: 16 }} onClick={submit} disabled={loading}>
        {loading ? 'Please wait...' : 'Save password'}
      </button>

      <p className="toggle-text">
        <button className="toggle-link" onClick={() => navigate('/', setRoute)}>Back to login</button>
      </p>
    </div>
  )
}
