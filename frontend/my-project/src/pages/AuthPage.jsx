import { useEffect, useState } from 'react'
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase/firebase.js";
import { GoogleIcon, FacebookIcon, GitHubIcon, Logo } from '../icon/Icon.jsx';
import { apiUrl } from '../config/api.js'
import { validateEmail, validatePassword } from '../utils/validators.js'
import { navigate, getTokenFromUrl } from '../utils/routing.js'

export default function AuthPage({ setRoute }) {
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
