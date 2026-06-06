import { useEffect, useState } from 'react'

const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').trim()

const navItems = [
  { path: '/home', label: 'Home' },
  { path: '/search', label: 'Search' },
  { path: '/reviews', label: 'Reviews' },
]

function navigate(path, setRoute) {
  window.history.pushState({}, '', path)
  setRoute(path)
}

export default function AppLayout({ route, setRoute, children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('estateTheme') || 'light')
  const [avatar, setAvatar] = useState(null)
  const [initials, setInitials] = useState('U')

  useEffect(() => {
    localStorage.setItem('estateTheme', theme)
  }, [theme])

  // เพิ่มตรงนี้
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) return
    fetch(`${apiUrl}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      const user = data.user
      if (user?.avatar) setAvatar(user.avatar)
      const i = `${user?.firstName?.charAt(0) || ''}${user?.lastName?.charAt(0) || ''}`.trim()
      setInitials(i || 'U')
    })
  }, [])

  function logout() {
    localStorage.removeItem('accessToken')
    navigate('/', setRoute)
  }

  return (
    <div className="estate-app" data-theme={theme}>
      <header className="estate-nav">
        <button className="brand-mark" onClick={() => navigate('/home', setRoute)} aria-label="Go home">
          <span className="brand-icon">E</span>
          <span>
            <strong>Estate</strong>
            <small>Modern living</small>
          </span>
        </button>

        <nav className="nav-links" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.path}
              className={route === item.path ? 'active' : ''}
              onClick={() => navigate(item.path, setRoute)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="nav-actions">
          <button className="icon-button" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label="Toggle theme">
            {theme === 'light' ? 'D' : 'L'}
          </button>
          
          <button 
            onClick={() => navigate('/profile', setRoute)}
            style={{
              width: 34, height: 34, borderRadius: '50%',
              overflow: 'hidden', border: 'none', cursor: 'pointer',
              background: 'var(--accent)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, color: 'var(--accent-text)'
            }}
          >
            {avatar 
              ? <img src={avatar} style={{width:'100%', height:'100%', objectFit:'cover'}} /> 
              : initials
            }
          </button>
          <button className="nav-logout" onClick={logout}>Logout</button>
        </div>
      </header>

      <main className="estate-main">{children}</main>
    </div>
  )
}