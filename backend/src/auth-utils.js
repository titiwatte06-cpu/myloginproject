import jwt from 'jsonwebtoken'

const sevenDays = 7 * 24 * 60 * 60 * 1000

export function signAuthToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.SECRET_KEY,
    { expiresIn: '7d' }
  )
}

export function setAuthCookie(res, token) {
  res.cookie('accessToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: sevenDays
  })
}

export function readCookie(req, name) {
  const cookie = req.headers.cookie
  if (!cookie) return ''

  return cookie
    .split(';')
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`))
    ?.split('=')
    .slice(1)
    .join('=') || ''
}

export function requireAuth(req, res, next) {
  const bearerToken = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : ''
  const token = bearerToken || readCookie(req, 'accessToken')

  if (!token) {
    return res.status(401).json({ message: 'Please login first' })
  }

  try {
    req.auth = jwt.verify(token, process.env.SECRET_KEY)
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}
