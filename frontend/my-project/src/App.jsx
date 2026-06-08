import { useEffect } from 'react'
import { Routes, Route, Outlet, useLocation, useNavigate } from 'react-router-dom'
import AppLayout from './pages/AppLayout.jsx'
import HomePage from './pages/HomePage.jsx'
import SearchPage from './pages/SearchPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import ReviewsPage from './pages/ReviewsPage.jsx'
import PropertyPage from './pages/PropertyPage.jsx'
import AuthPage from './pages/AuthPage.jsx'
import ChangePasswordPage from './pages/ChangePasswordPage.jsx'
import './styles/realEstate.css'
import { authStyles } from './styles/authStyles.js'
import { apiUrl } from './config/api.js'
import { appRoutes } from './utils/routing.js'


function RootShell() {
  const { pathname } = useLocation()
  const isAppRoute = appRoutes.includes(pathname)
  const isProfileRoute = pathname.startsWith('/profile')

  return (
    <div className={`page-shell ${isAppRoute || isProfileRoute ? 'estate-shell' : ''}`}>
      <style>{authStyles}</style>
      <Outlet />
    </div>
  )
}

function ProtectedLayout() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}

export default function App() {
  const navigate = useNavigate()

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
        navigate('/')
      }
    })
    .catch(() => {
      localStorage.removeItem('accessToken')
      navigate('/')
    })
  }, [navigate])

  return (
    <Routes>
      <Route element={<RootShell />}>
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/my-listings" element={<PropertyPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<AuthPage />} />
      </Route>
    </Routes>
  )
}
