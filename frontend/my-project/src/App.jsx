import { useEffect, useState } from 'react'
import AppLayout from './pages/AppLayout.jsx'
import HomePage from './pages/HomePage.jsx'
import SearchPage from './pages/SearchPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import ReviewsPage from './pages/ReviewsPage.jsx'
import AuthPage from './pages/AuthPage.jsx'
import ChangePasswordPage from './pages/ChangePasswordPage.jsx'
import './styles/realEstate.css'
import { authStyles } from './styles/authStyles.js'
import { apiUrl } from './config/api.js'
import { appRoutes, navigate } from './utils/routing.js'


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
      <style>{authStyles}</style>
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
