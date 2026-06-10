import { useEffect, useRef, useState } from 'react'

const navItems = [
  { path: '/home', label: 'Home' },
  { path: '/search', label: 'Search' },
  { path: '/reviews', label: 'Reviews' },
  { path: '/messages', label: 'Messages' },
]

const userMenuItems = [
  { path: '/profile', label: 'Profile' },
  { path: '/my-listings', label: 'My listings' },
]

export default function EstateNavbar({ pathname, navigate, theme, setTheme, avatar, initials, logout }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) return
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  function goTo(path) {
    setMenuOpen(false)
    navigate(path)
  }

  function handleLogout() {
    setMenuOpen(false)
    logout()
  }

  return (
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
            className={pathname.startsWith(item.path) ? 'active' : ''}
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

        <div className="nav-user" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((open) => !open)}
            aria-haspopup="true"
            aria-expanded={menuOpen}
            className="w-8.5 h-8.5 rounded-full overflow-hidden border-none cursor-pointer bg-(--accent) flex items-center justify-center font-bold text-(--accent-text)"
          >
            {avatar
              ? <img src={avatar} className="w-full h-full object-cover" />
              : initials
            }
          </button>

          {menuOpen && (
            <div className="nav-user-menu" role="menu">
              {userMenuItems.map((item) => (
                <button
                  key={item.path}
                  role="menuitem"
                  className={pathname === item.path ? 'active' : ''}
                  onClick={() => goTo(item.path)}
                >
                  {item.label}
                </button>
              ))}
              <button role="menuitem" className="nav-user-menu-logout" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
