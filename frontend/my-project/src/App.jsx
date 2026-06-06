import { useEffect, useState } from 'react'
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebase.js";
import AppLayout from './pages/AppLayout.jsx'
import HomePage from './pages/HomePage.jsx'
import SearchPage from './pages/SearchPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import ReviewsPage from './pages/ReviewsPage.jsx'
import './styles/realEstate.css'


const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').trim()
const appRoutes = ['/home', '/search', '/reviews']

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
)

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2" />
  </svg>
)

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" fill="currentColor" />
  </svg>
)

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="2" width="20" height="4" rx="2" fill="black" />
    <rect x="6" y="8" width="14" height="4" rx="2" fill="black" />
    <rect x="6" y="14" width="20" height="4" rx="2" fill="black" />
    <rect x="6" y="20" width="10" height="4" rx="2" fill="black" />
    <rect x="6" y="26" width="20" height="4" rx="2" fill="black" />
  </svg>
)

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
  .page-shell { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px 16px; background:#f5f5f5; font-family:'DM Sans','Helvetica Neue',sans-serif; }
  .auth-card { background:#fff; border-radius:20px; border:1px solid #e8e8e8; padding:40px 32px; width:100%; max-width:380px; box-shadow:0 4px 40px rgba(0,0,0,0.07); animation:slideUp 0.4s cubic-bezier(0.16,1,0.3,1); }
  @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  .field-wrap { display:flex; flex-direction:column; gap:6px; }
  .field-label { font-size:13px; font-weight:600; color:#1a1a1a; }
  .field-input { border:1.5px solid #e4e4e4; border-radius:10px; padding:11px 14px; font-size:14px; font-family:inherit; outline:none; background:#fafafa; color:#1a1a1a; transition:all 0.18s; width:100%; box-sizing:border-box; }
  .field-input:focus { border-color:#1a1a1a; background:#fff; box-shadow:0 0 0 3px rgba(0,0,0,0.06); }
  .field-input.has-error { border-color:#ff4d4d; background:#fff8f8; }
  .pass-wrap { position:relative; }
  .pass-toggle { position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:#777; font-size:12px; font-weight:700; font-family:inherit; padding:0; }
  .btn-primary { background:#1a1a1a; color:#fff; border:none; border-radius:10px; padding:13px; font-size:14px; font-weight:600; font-family:inherit; cursor:pointer; width:100%; transition:background 0.16s,transform 0.12s; }
  .btn-primary:hover { background:#333; transform:translateY(-1px); }
  .btn-primary:disabled { cursor:not-allowed; opacity:.65; transform:none; }
  .divider { display:flex; align-items:center; gap:12px; color:#aaa; font-size:12px; }
  .divider::before,.divider::after { content:''; flex:1; height:1px; background:#ebebeb; }
  .btn-social { display:flex; align-items:center; justify-content:center; gap:10px; border:1.5px solid #e8e8e8; border-radius:10px; padding:11px; font-size:13.5px; font-weight:500; font-family:inherit; cursor:pointer; background:#fff; color:#1a1a1a; width:100%; transition:border-color 0.15s,background 0.15s,transform 0.12s; }
  .btn-social:hover { border-color:#bbb; background:#fafafa; transform:translateY(-1px); }
  .toggle-text { font-size:13px; color:#777; text-align:center; margin:0; }
  .toggle-link { color:#1a1a1a; font-size:13px; font-weight:50; cursor:pointer; text-decoration:none; background:none; border:none; font-family:inherit; padding:0; }
  .mode-switch { display:flex; background:#f2f2f2; border-radius:10px; padding:3px; gap:3px; margin-bottom:24px; }
  .mode-btn { flex:1; padding:8px; border:none; border-radius:8px; font-size:13px; font-weight:600; font-family:inherit; cursor:pointer; transition:all 0.2s; background:transparent; color:#777; }
  .mode-btn.active { background:#fff; color:#1a1a1a; box-shadow:0 1px 6px rgba(0,0,0,0.1); }
  .field-error { color:#d93025; font-size:12.5px; font-weight:500; margin:0; }
  .status { border-radius:10px; padding:10px 12px; font-size:13px; line-height:1.4; margin-bottom:16px; }
  .status.ok { background:#edf7ed; color:#1e6b35; }
  .status.bad { background:#fff2f0; color:#b42318; }
`



function validateEmail(value) {
  if (!value) return 'Please enter your email'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email format is invalid'
  return ''
}

function validatePassword(value) {
  if (!value) return 'Please enter your password'
  if (value.length < 8) return 'Password must be at least 8 characters'
  return ''
}

function navigate(path, setRoute) {
  window.history.pushState({}, '', path)
  setRoute(path)
}

function getTokenFromUrl() {
  const params = new URLSearchParams(window.location.search)
  return params.get('token')
}

function AuthPage({ setRoute }) {
  const [mode, setMode] = useState('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const isLogin = mode === 'login'


  const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    localStorage.setItem('accessToken', await user.getIdToken());
    setStatus({ type: 'ok', text: `Welcome ${user.displayName}` });
    navigate('/home', setRoute)
  } catch (err) {
    console.error(err);
    setStatus({ type: 'bad', text: 'Google login failed' });
  }
};

  useEffect(() => {
    const token = getTokenFromUrl()
    const params = new URLSearchParams(window.location.search)
    const oauthStatus = params.get('oauth')

    if (token) {
      localStorage.setItem('accessToken', token)
      window.history.replaceState({}, '', '/home')
      window.setTimeout(() => setRoute('/home'), 0)
    } else if (oauthStatus === 'failed') {
      window.setTimeout(() => setStatus({ type: 'bad', text: 'OAuth login failed' }), 0)
    } else if (oauthStatus === 'no-email') {
      window.setTimeout(() => setStatus({ type: 'bad', text: 'OAuth account has no public email' }), 0)
    }
  }, [setRoute])

  async function submit() {
    const nextEmailError = validateEmail(email)
    const nextPasswordError = validatePassword(password)

    setEmailError(nextEmailError)
    setPasswordError(nextPasswordError)
    setStatus(null)

    if (nextEmailError || nextPasswordError) return

    try {
      setLoading(true)
      const endpoint = isLogin ? '/login' : '/register'
      const res = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()

      if (!res.ok) {
        setStatus({ type: 'bad', text: data.message || 'Something went wrong' })
        return
      }

      if (data.token) localStorage.setItem('accessToken', data.token)
      setEmail('')
      setPassword('')
      if (isLogin) {
        navigate('/home', setRoute)
        return
      }
      setMode('login')
      setStatus({ type: 'ok', text: data.message || 'Registration successful. Please log in.' })
    } catch {
      setStatus({ type: 'bad', text: 'Cannot connect to server' })
    } finally {
      setLoading(false)
    }
  }

  function startOAuth(provider) {
    window.location.href = `${apiUrl}/auth/${provider}`
  }

  return (
    <div className="auth-card">
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <Logo />
      </div>

      <div className="mode-switch">
        <button className={`mode-btn ${!isLogin ? 'active' : ''}`} onClick={() => setMode('signup')}>Sign up</button>
        <button className={`mode-btn ${isLogin ? 'active' : ''}`} onClick={() => setMode('login')}>Log in</button>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', margin: 0, marginBottom: 4 }}>
          {isLogin ? 'Welcome back' : 'Create an account'}
        </h1>
        <p style={{ fontSize: 13.5, color: '#777', margin: 0 }}>
          {isLogin ? 'Sign in to continue' : 'Start your journey today'}
        </p>
      </div>

      {status && <div className={`status ${status.type}`}>{status.text}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 18 }}>
        <div className="field-wrap">
          <label className="field-label">Email</label>
          <input
            className={`field-input ${emailError ? 'has-error' : ''}`}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setEmailError(validateEmail(e.target.value))
            }}
          />
          {emailError && <p className="field-error">{emailError}</p>}
        </div>

        <div className="field-wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="field-label">Password</label>
            {isLogin && (
              <button className="toggle-link" onClick={() => navigate('/change-password', setRoute)}>
                Forget password
              </button>
            )}
          </div>
          <div className="pass-wrap">
            <input
              className={`field-input ${passwordError ? 'has-error' : ''}`}
              type={showPass ? 'text' : 'password'}
              placeholder={isLogin ? 'Your password' : 'Min. 8 characters'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setPasswordError(validatePassword(e.target.value))
              }}
              style={{ paddingRight: 56 }}
            />
            <button className="pass-toggle" onClick={() => setShowPass((value) => !value)}>
              {showPass ? 'HIDE' : 'SHOW'}
            </button>
          </div>
          {passwordError && <p className="field-error">{passwordError}</p>}
        </div>
      </div>

      <button className="btn-primary" style={{ marginBottom: 18 }} onClick={submit} disabled={loading}>
        {loading ? 'Please wait...' : isLogin ? 'Sign in' : 'Create Account'}
      </button>

      <div className="divider" style={{ marginBottom: 14 }}>or continue with</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
        <button className="btn-social" onClick={loginWithGoogle}><GoogleIcon /> Google</button>
        <button className="btn-social" onClick={() => startOAuth('facebook')}><FacebookIcon /> Facebook</button>
        <button className="btn-social" onClick={() => startOAuth('github')}><GitHubIcon /> GitHub</button>
      </div>

      <p className="toggle-text">
        {isLogin ? "Don't have an account? " : 'Already a user? '}
        <button className="toggle-link" onClick={() => setMode(isLogin ? 'signup' : 'login')}>
          {isLogin ? 'Sign up' : 'Login'}
        </button>
      </p>
    </div>
  )
}

function ChangePasswordPage({ setRoute }) {
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

export default function App() {
  const [route, setRoute] = useState(window.location.pathname)
  const isAppRoute = appRoutes.includes(route)
  const isProfileRoute = route.startsWith('/profile')

  useEffect(() => {
    const onPopState = () => setRoute(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  // เพิ่มตรงนี้
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) return

    fetch(`${apiUrl}/me`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include'
    })
    .then(res => {
      if (!res.ok) {
        localStorage.removeItem('accessToken')
        navigate('/', setRoute)
      }
    })
    .catch(() => {
      localStorage.removeItem('accessToken')
      navigate('/', setRoute)
    })
  }, [])

  return (
    <div className={`page-shell ${isAppRoute  || isProfileRoute ? 'estate-shell' : ''}`}>
      <style>{styles}</style>
      {isAppRoute ? (
        <AppLayout route={route} setRoute={setRoute}>
          {route === '/search' && <SearchPage />}
          {route === '/reviews' && <ReviewsPage />}
          {route === '/home' && <HomePage setRoute={setRoute} />}
        </AppLayout>
      ) : isProfileRoute ? (
        <AppLayout route={route} setRoute={setRoute}>
          <ProfilePage username={route.split('/profile/')[1]} setRoute={setRoute} />
        </AppLayout>
      )
      
      : route === '/change-password' ? (
        <ChangePasswordPage setRoute={setRoute} />
      ) : (
        <AuthPage setRoute={setRoute} />
      )}
    </div>
  )
}
