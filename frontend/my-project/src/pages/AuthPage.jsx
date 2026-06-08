import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase/firebase.js";
import { GoogleIcon, FacebookIcon, GitHubIcon, Logo } from '../icon/Icon.jsx';
import { apiUrl } from '../config/api.js'
import { validateEmail, validatePassword } from '../utils/validators.js'

const inputBase = 'w-full border-[1.5px] border-neutral-200 rounded-[10px] px-3.5 py-2.5 text-sm bg-neutral-50 text-neutral-900 outline-none transition-all box-border focus:border-neutral-900 focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,0,0,0.06)]'
const inputError = 'border-red-400 bg-red-50'

export default function AuthPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
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
    navigate('/home')
  } catch (err) {
    console.error(err);
    setStatus({ type: 'bad', text: 'Google login failed' });
  }
};

  useEffect(() => {
    const token = searchParams.get('token')
    const oauthStatus = searchParams.get('oauth')

    if (token) {
      localStorage.setItem('accessToken', token)
      window.setTimeout(() => navigate('/home', { replace: true }), 0)
    } else if (oauthStatus === 'failed') {
      window.setTimeout(() => setStatus({ type: 'bad', text: 'OAuth login failed' }), 0)
    } else if (oauthStatus === 'no-email') {
      window.setTimeout(() => setStatus({ type: 'bad', text: 'OAuth account has no public email' }), 0)
    }
  }, [searchParams, navigate])

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
        navigate('/home')
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
    <div className="bg-white rounded-[20px] border border-neutral-200 px-8 py-10 w-full max-w-[380px] shadow-[0_4px_40px_rgba(0,0,0,0.07)] animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)]">
      <div className="flex justify-center mb-5">
        <Logo />
      </div>

      <div className="flex bg-neutral-100 rounded-[10px] p-[3px] gap-[3px] mb-6">
        <button
          className={`flex-1 py-2 rounded-lg text-[13px] font-semibold cursor-pointer transition-all border-none ${!isLogin ? 'bg-white text-neutral-900 shadow-[0_1px_6px_rgba(0,0,0,0.1)]' : 'bg-transparent text-neutral-500'}`}
          onClick={() => setMode('signup')}
        >Sign up</button>
        <button
          className={`flex-1 py-2 rounded-lg text-[13px] font-semibold cursor-pointer transition-all border-none ${isLogin ? 'bg-white text-neutral-900 shadow-[0_1px_6px_rgba(0,0,0,0.1)]' : 'bg-transparent text-neutral-500'}`}
          onClick={() => setMode('login')}
        >Log in</button>
      </div>

      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-neutral-900 m-0 mb-1">
          {isLogin ? 'Welcome back' : 'Create an account'}
        </h1>
        <p className="text-[13.5px] text-neutral-500 m-0">
          {isLogin ? 'Sign in to continue' : 'Start your journey today'}
        </p>
      </div>

      {status && (
        <div className={`rounded-[10px] px-3 py-2.5 text-[13px] leading-snug mb-4 ${status.type === 'ok' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>
          {status.text}
        </div>
      )}

      <div className="flex flex-col gap-3.5 mb-[18px]">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-neutral-900">Email</label>
          <input
            className={`${inputBase} ${emailError ? inputError : ''}`}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setEmailError(validateEmail(e.target.value))
            }}
          />
          {emailError && <p className="text-red-600 text-[12.5px] font-medium m-0">{emailError}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-[13px] font-semibold text-neutral-900">Password</label>
            {isLogin && (
              <button className="text-neutral-900 text-[13px] font-medium cursor-pointer bg-transparent border-none p-0" onClick={() => navigate('/change-password')}>
                Forget password
              </button>
            )}
          </div>
          <div className="relative">
            <input
              className={`${inputBase} ${passwordError ? inputError : ''} pr-14`}
              type={showPass ? 'text' : 'password'}
              placeholder={isLogin ? 'Your password' : 'Min. 8 characters'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setPasswordError(validatePassword(e.target.value))
              }}
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-neutral-500 text-xs font-bold p-0" onClick={() => setShowPass((value) => !value)}>
              {showPass ? 'HIDE' : 'SHOW'}
            </button>
          </div>
          {passwordError && <p className="text-red-600 text-[12.5px] font-medium m-0">{passwordError}</p>}
        </div>
      </div>

      <button className="w-full bg-neutral-900 text-white border-none rounded-[10px] py-[13px] text-sm font-semibold cursor-pointer transition-all hover:bg-neutral-700 hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-65 disabled:translate-y-0 mb-[18px]" onClick={submit} disabled={loading}>
        {loading ? 'Please wait...' : isLogin ? 'Sign in' : 'Create Account'}
      </button>

      <div className="flex items-center gap-3 text-neutral-400 text-xs mb-3.5 before:content-[''] before:flex-1 before:h-px before:bg-neutral-200 after:content-[''] after:flex-1 after:h-px after:bg-neutral-200">or continue with</div>

      <div className="flex flex-col gap-2 mb-[22px]">
        <button className="w-full flex items-center justify-center gap-2.5 border-[1.5px] border-neutral-200 rounded-[10px] py-2.5 text-[13.5px] font-medium cursor-pointer bg-white text-neutral-900 transition-all hover:border-neutral-400 hover:bg-neutral-50 hover:-translate-y-px" onClick={loginWithGoogle}><GoogleIcon /> Google</button>
        <button className="w-full flex items-center justify-center gap-2.5 border-[1.5px] border-neutral-200 rounded-[10px] py-2.5 text-[13.5px] font-medium cursor-pointer bg-white text-neutral-900 transition-all hover:border-neutral-400 hover:bg-neutral-50 hover:-translate-y-px" onClick={() => startOAuth('facebook')}><FacebookIcon /> Facebook</button>
        <button className="w-full flex items-center justify-center gap-2.5 border-[1.5px] border-neutral-200 rounded-[10px] py-2.5 text-[13.5px] font-medium cursor-pointer bg-white text-neutral-900 transition-all hover:border-neutral-400 hover:bg-neutral-50 hover:-translate-y-px" onClick={() => startOAuth('github')}><GitHubIcon /> GitHub</button>
      </div>

      <p className="text-[13px] text-neutral-500 text-center m-0">
        {isLogin ? "Don't have an account? " : 'Already a user? '}
        <button className="text-neutral-900 text-[13px] font-medium cursor-pointer bg-transparent border-none p-0" onClick={() => setMode(isLogin ? 'signup' : 'login')}>
          {isLogin ? 'Sign up' : 'Login'}
        </button>
      </p>
    </div>
  )
}
