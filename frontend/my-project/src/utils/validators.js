export function validateEmail(value) {
  if (!value) return 'Please enter your email'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email format is invalid'
  return ''
}

export function validatePassword(value) {
  if (!value) return 'Please enter your password'
  if (value.length < 8) return 'Password must be at least 8 characters'
  return ''
}
