// import { useState } from 'react'
// import Login from '../components/Login'
// import './App.css'


// function App() {
//   return (
//     <div className="flex justify-center items-center bg-slate-100 h-screen px-10 py-12">
//       <div className='bg-white w-150 h-80 px-10 py-12 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.10)] flex flex-col items-center gap-5'>
//         <div className="background: var(--color-background-primary); border-radius: 20px; border: 0.5px solid var(--color-border-tertiary); padding: 2.5rem 2rem; width: 340px; display: flex; flex-direction: column; gap: 1rem;">
//           <h2 className='text-2xl font-bold text-center text-gray-800'>Welcome back</h2>
//           <p className='text-sm text-center text-gray-400 -mt-3'>Sign in to your account</p>
//           <input className='border border-gray-200 px-4 py-3 rounded-xl w-full outline-none text-sm focus:border-black transition-all' placeholder='Email'/>
//           <input className='border border-gray-200 px-4 py-3 rounded-xl w-full outline-none text-sm focus:border-black transition-all' placeholder='Password' type='password'/>
//           <button className='bg-black text-white py-3 rounded-xl w-full text-sm font-medium hover:bg-gray-800 transition-all'>Sign in</button>
//           <p className='text-xs text-center text-gray-400'>Don't have an account? <span className='text-black font-medium cursor-pointer'>Sign up</span></p>
//         </div>
        
//       </div>
//     </div>
//   )
// }


// export default App

import { useState } from 'react'
 
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)
 
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
  </svg>
)
 
const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" fill="currentColor"/>
  </svg>
)
 
const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="2" width="20" height="4" rx="2" fill="black"/>
    <rect x="6" y="8" width="14" height="4" rx="2" fill="black"/>
    <rect x="6" y="14" width="20" height="4" rx="2" fill="black"/>
    <rect x="6" y="20" width="10" height="4" rx="2" fill="black"/>
    <rect x="6" y="26" width="20" height="4" rx="2" fill="black"/>
  </svg>
)
 
export default function App() {
  const [mode, setMode] = useState('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [message, setMessage] = useState("");

  const isLogin = mode === 'login'
 
  

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value));
    setMessage('');
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));
    setMessage('');
  };

  const validateEmail = (value) => {
    if (!value) {
      return 'กรุณากรอกอีเมล';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'รูปแบบอีเมลไม่ถูกต้อง';
    }
    return '';
  };

  const validatePassword = (value) => {
    if (!value) {
      return 'กรุณากรอกรหัสผ่าน';
    }
    if (value.length < 8) {
      return 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร';
    }
    return '';
  };

  async function sendData() {

    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)

  // ถ้ามี error อย่างใดอย่างหนึ่ง → หยุดเลย ไม่ส่ง
    if (emailError || passwordError) {
      setEmailError(emailError)
      setPasswordError(passwordError)
      alert("อีเมลและรหัสไม่ถูกต้อง")
      setEmail('')
      setPassword('')
      return  // ← สำคัญมาก หยุดตรงนี้
    }
    try {
      const endpoint = isLogin ? '/login' : '/register'
      const res = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      alert('success')
      setEmail('')
      setPassword('')
      console.log(data)
    } catch (err) {
      console.log(err)
    }
  }
 
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#f5f5f5', fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .auth-card { background:#fff; border-radius:20px; border:1px solid #e8e8e8; padding:40px 32px; width:100%; max-width:380px; box-shadow:0 4px 40px rgba(0,0,0,0.07); animation:slideUp 0.4s cubic-bezier(0.16,1,0.3,1); }
        @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .field-wrap { display:flex; flex-direction:column; gap:5px; }
        .field-label { font-size:13px; font-weight:600; color:#1a1a1a; letter-spacing:0.01em; }
        .field-input { border:1.5px solid #e4e4e4; border-radius:10px; padding:11px 14px; font-size:14px; font-family:inherit; outline:none; background:#fafafa; color:#1a1a1a; transition:all 0.18s; width:100%; box-sizing:border-box; }
        .field-input:focus { border-color:#1a1a1a; background:#fff; box-shadow:0 0 0 3px rgba(0,0,0,0.06); }
        .field-input::placeholder { color:#bbb; }
        .field-input.has-error { border-color:#ff4d4d; background:#fff8f8; }
        .field-input.has-error:focus { border-color:#ff4d4d; box-shadow:0 0 0 3px rgba(255,77,77,0.15); }
        .pass-wrap { position:relative; }
        .pass-toggle { position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:#999; font-size:12px; font-weight:600; font-family:inherit; padding:0; letter-spacing:0.03em; }
        .pass-toggle:hover { color:#1a1a1a; }
        .btn-primary { background:#1a1a1a; color:#fff; border:none; border-radius:10px; padding:13px; font-size:14px; font-weight:600; font-family:inherit; cursor:pointer; width:100%; letter-spacing:0.01em; transition:background 0.16s,transform 0.12s; }
        .btn-primary:hover { background:#333; transform:translateY(-1px); }
        .btn-primary:active { transform:translateY(0); }
        .divider { display:flex; align-items:center; gap:12px; color:#ccc; font-size:12px; }
        .divider::before,.divider::after { content:''; flex:1; height:1px; background:#ebebeb; }
        .btn-social { display:flex; align-items:center; justify-content:center; gap:10px; border:1.5px solid #e8e8e8; border-radius:10px; padding:11px; font-size:13.5px; font-weight:500; font-family:inherit; cursor:pointer; background:#fff; color:#1a1a1a; width:100%; transition:border-color 0.15s,background 0.15s,transform 0.12s; }
        .btn-social:hover { border-color:#bbb; background:#fafafa; transform:translateY(-1px); }
        .btn-social:active { transform:translateY(0); }
        .toggle-text { font-size:13px; color:#999; text-align:center; }
        .toggle-link { color:#1a1a1a; font-weight:700; cursor:pointer; text-decoration:none; transition:opacity 0.15s; }
        .toggle-link:hover { opacity:0.6; }
        .mode-switch { display:flex; background:#f2f2f2; border-radius:10px; padding:3px; gap:3px; }
        .mode-btn { flex:1; padding:8px; border:none; border-radius:8px; font-size:13px; font-weight:600; font-family:inherit; cursor:pointer; transition:all 0.2s; background:transparent; color:#999; }
        .mode-btn.active { background:#fff; color:#1a1a1a; box-shadow:0 1px 6px rgba(0,0,0,0.1); }
        .field-error { color:#ff0000; font-size:12.5px; font-weight:500; margin:4px 0 0 0; }
      `}</style>
 
      <div className="auth-card">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <Logo />
        </div>
 
        <div className="mode-switch" style={{ marginBottom: 24 }}>
          <button className={`mode-btn ${!isLogin ? 'active' : ''}`} onClick={() => setMode('signup')}>Sign up</button>
          <button className={`mode-btn ${isLogin ? 'active' : ''}`} onClick={() => setMode('login')}>Log in</button>
        </div>
 
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', margin: 0, marginBottom: 4 }}>
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h1>
          <p style={{ fontSize: 13.5, color: '#999', margin: 0 }}>
            {isLogin ? 'Sign in to continue' : 'Start your journey today'}
          </p>
        </div>
 
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 18 }}>
 
          {/* Email field */}
          <div className="field-wrap">
            <label className="field-label">Email</label>
            <input
              className={emailError ? 'input-error' : ''}
              type="text"
              placeholder="you@example.com"
              value={email}
              onChange={handleEmailChange}
              onBlur={() => setEmailError(validateEmail(email))}
              className={emailError ? 'input-error' : ''}
            />
            {/* ✅ แสดง error ของ Email ในตำแหน่งที่ถูกต้อง */}
            {emailError && <p className="field-error">{emailError}</p>}
          </div>

 
          {/* Password field */}
          <div className="field-wrap">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="field-label">Password</label>
              {isLogin && <span style={{ fontSize: 12, color: '#888', cursor: 'pointer', fontWeight: 500 }}>Forgot?</span>}
            </div>
            <div className="pass-wrap">
              <input
                className={passwordError ? 'input-error' : ''}
                type={showPass ? 'text' : 'password'}
                placeholder={isLogin ? '••••••••' : 'Min. 8 characters'}
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => setPasswordError(validatePassword(password))}
                className={passwordError ? 'input-error' : ''}
                style={{ paddingRight: 52 }}
              />

              <button className="pass-toggle" onClick={() => setShowPass(p => !p)}>
                {showPass ? 'HIDE' : 'SHOW'}
              </button>
            </div>
            {passwordError && <p className="field-error">{passwordError}</p>}
            {/* ✅ แสดง error ของ Password ในตำแหน่งที่ถูกต้อง (ย้ายออกมาจาก pass-wrap) */}
            
          </div>
 
        </div>
 
        <button className="btn-primary" style={{ marginBottom: 18 }} onClick={sendData}>
          {isLogin ? 'Sign in' : 'Create Account'}
        </button>
 
        <div className="divider" style={{ marginBottom: 14 }}>or continue with</div>
 
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
          <button className="btn-social"><GoogleIcon /> Google</button>
          <button className="btn-social"><FacebookIcon /> Facebook</button>
          <button className="btn-social"><GitHubIcon /> GitHub</button>
        </div>
 
        <p className="toggle-text">
          {isLogin ? "Don't have an account? " : 'Already a user? '}
          <span className="toggle-link" onClick={() => setMode(isLogin ? 'signup' : 'login')}>
            {isLogin ? 'Sign up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  )
}