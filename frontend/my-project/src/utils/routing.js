export const appRoutes = ['/home', '/search', '/reviews']

export function navigate(path, setRoute) {
  window.history.pushState({}, '', path)
  setRoute(path)
}

export function getTokenFromUrl() {
  const params = new URLSearchParams(window.location.search)
  return params.get('token')
}
