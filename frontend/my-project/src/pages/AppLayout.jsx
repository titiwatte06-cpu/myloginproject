import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import EstateNavbar from '../components/EstateNavbar'
import { apiUrl } from '../config/api.js'

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
      <EstateNavbar
        pathname={pathname}
        navigate={navigate}
        theme={theme}
        setTheme={setTheme}
        avatar={avatar}
        initials={initials}
        logout={logout}
      />

      <main className="estate-main">{children}</main>
    </div>
  )
}