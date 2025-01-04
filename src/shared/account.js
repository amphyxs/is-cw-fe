export const getCurrentAccount = () => {
  const token = localStorage.getItem('jwt')
  const login = localStorage.getItem('login')
  const role = localStorage.getItem('role')

  return { token, login, role }
}

export const storeCurrentAccount = ({ token, login, role }) => {
  localStorage.setItem('token', token)
  localStorage.setItem('login', login)
  localStorage.setItem('role', role)
}

export const isLoggedIn = () => {
  // TODO: check token
  return !!getCurrentAccount().login
}
