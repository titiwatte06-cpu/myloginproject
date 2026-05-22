import { useEffect, useState } from 'react'

const navItems = [
  { path: '/home', label: 'Home' },
  { path: '/search', label: 'Search' },
  { path: '/reviews', label: 'Reviews' },
  { path: '/profile', label: 'Profile' }
]

function navigate(path, setRoute) {
  window.history.pushState({}, '', path)
  setRoute(path)
}

export default function AppLayout({ route, setRoute, children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('estateTheme') || 'light')

  useEffect(() => {
    localStorage.setItem('estateTheme', theme)
  }, [theme])

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
          <button className="nav-logout" onClick={logout}>Logout</button>
        </div>
      </header>

      <main className="estate-main">{children}</main>
    </div>
  )
}
