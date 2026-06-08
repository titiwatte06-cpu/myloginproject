import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').trim()

const navItems = [
  { path: '/home', label: 'Home' },
  { path: '/search', label: 'Search' },
  { path: '/reviews', label: 'Reviews' },
]

export default function AppLayout({ children }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
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
    navigate('/')
  }

  return (
    <div className="estate-app" data-theme={theme}>
      <header className="estate-nav">
        <button className="brand-mark" onClick={() => navigate('/home')} aria-label="Go home">
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
              className={pathname === item.path ? 'active' : ''}
              onClick={() => navigate(item.path)}
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
            onClick={() => navigate('/profile')}
            className="w-8.5 h-8.5 rounded-full overflow-hidden border-none cursor-pointer bg-(--accent) flex items-center justify-center font-bold text-(--accent-text)"
          >
            {avatar
              ? <img src={avatar} className="w-full h-full object-cover" />
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