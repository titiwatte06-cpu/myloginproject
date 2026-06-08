import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '../icon/Icon.jsx';
import { apiUrl } from '../config/api.js'
import { validatePassword } from '../utils/validators.js'

const inputBase = 'w-full border-[1.5px] border-neutral-200 rounded-[10px] px-3.5 py-2.5 text-sm bg-neutral-50 text-neutral-900 outline-none transition-all box-border focus:border-neutral-900 focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,0,0,0.06)]'

export default function ChangePasswordPage() {
  const navigate = useNavigate()
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
    <div className="bg-white rounded-[20px] border border-neutral-200 px-8 py-10 w-full max-w-[380px] shadow-[0_4px_40px_rgba(0,0,0,0.07)] animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)]">
      <div className="flex justify-center mb-5">
        <Logo />
      </div>

      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-neutral-900 m-0 mb-1">
          Change password
        </h1>
        <p className="text-[13.5px] text-neutral-500 m-0">
          Update your account password
        </p>
      </div>

      {status && (
        <div className={`rounded-[10px] px-3 py-2.5 text-[13px] leading-snug mb-4 ${status.type === 'ok' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>
          {status.text}
        </div>
      )}

      <div className="flex flex-col gap-3.5 mb-[18px]">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-neutral-900">Current password</label>
          <input
            className={inputBase}
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-neutral-900">New password</label>
          <input
            className={inputBase}
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-neutral-900">Confirm new password</label>
          <input
            className={inputBase}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>

      <button className="w-full bg-neutral-900 text-white border-none rounded-[10px] py-[13px] text-sm font-semibold cursor-pointer transition-all hover:bg-neutral-700 hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-65 disabled:translate-y-0 mb-4" onClick={submit} disabled={loading}>
        {loading ? 'Please wait...' : 'Save password'}
      </button>

      <p className="text-[13px] text-neutral-500 text-center m-0">
        <button className="text-neutral-900 text-[13px] font-medium cursor-pointer bg-transparent border-none p-0" onClick={() => navigate('/')}>Back to login</button>
      </p>
    </div>
  )
}
