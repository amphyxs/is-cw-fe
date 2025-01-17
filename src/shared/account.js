import { teardownAchivements } from '@/shared/achievements'
import { computed, ref } from 'vue'

export const currentAccount = ref({
  token: localStorage.getItem('token'),
  login: localStorage.getItem('login'),
  roles: localStorage.getItem('roles') ?? [],
  isTutorialCompleted: JSON.parse(localStorage.getItem('isTutorialCompleted')) ?? true,
})

// TODO: remove this
export const getCurrentAccount = () => {
  return currentAccount.value
}

export const storeCurrentAccount = ({ token, login, roles, isTutorialCompleted }) => {
  if (token && login && roles) {
    localStorage.setItem('token', token)
    localStorage.setItem('login', login)
    localStorage.setItem('roles', roles)
    localStorage.setItem('isTutorialCompleted', isTutorialCompleted)

    currentAccount.value = { token, login, roles, isTutorialCompleted }
  }
}

export const isLoggedIn = computed(() => {
  // TODO: check token
  return !!currentAccount.value?.login
})

export const signOut = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('login')
  localStorage.removeItem('roles')
  localStorage.removeItem('isTutorialCompleted')
  currentAccount.value = null
  teardownAchivements()
  location.reload()
}
