import { computed, ref } from 'vue'

export const currentAccount = ref({
  token: localStorage.getItem('token'),
  login: localStorage.getItem('login'),
  role: localStorage.getItem('role'),
  isTutorialCompleted: localStorage.getItem('isTutorialCompleted'),
})

// TODO: remove this
export const getCurrentAccount = () => {
  return currentAccount.value
}

export const storeCurrentAccount = ({ token, login, role, isTutorialCompleted }) => {
  if (token && login && role) {
    localStorage.setItem('token', token)
    localStorage.setItem('login', login)
    localStorage.setItem('role', role)
    localStorage.setItem('isTutorialCompleted', isTutorialCompleted)

    currentAccount.value = { token, login, role, isTutorialCompleted }
  }
}

export const isLoggedIn = computed(() => {
  // TODO: check token
  return !!currentAccount.value?.login
})

export const signOut = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('login')
  localStorage.removeItem('role')
  localStorage.removeItem('isTutorialCompleted')
  currentAccount.value = null
  location.reload()
}
