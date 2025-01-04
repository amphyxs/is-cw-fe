import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { isLoggedIn, getCurrentAccount } from '@/shared/account'

const loggedInGuard = (_, __, next) => {
  if (isLoggedIn()) {
    next()
    return
  }

  next({
    name: 'sign-in',
  })
}

const loggedInAndHasRoleGuard = (role) => {
  return (_, __, next) => {
    if (isLoggedIn() && getCurrentAccount().role === role) {
      next()
      return
    }

    next({
      name: 'sign-in',
    })
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      beforeEnter: loggedInGuard,
    },
    {
      path: '/store',
      name: 'store',
      component: () => import('../views/StoreView.vue'),
      beforeEnter: loggedInGuard,
    },
    {
      path: '/library',
      name: 'library',
      component: () => import('../views/LibraryView.vue'),
      beforeEnter: loggedInGuard,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      beforeEnter: loggedInGuard,
    },
    {
      path: '/guides',
      name: 'guides',
      component: () => import('../views/GuidesView.vue'),
      beforeEnter: loggedInGuard,
    },
    {
      path: '/trading',
      name: 'trading',
      component: () => import('../views/TradingView.vue'),
      beforeEnter: loggedInGuard,
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('../views/AccountView.vue'),
      beforeEnter: loggedInGuard,
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../views/CartView.vue'),
      beforeEnter: loggedInGuard,
    },
    {
      path: '/sign-in',
      name: 'sign-in',
      component: () => import('../views/SignInView.vue'),
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: () => import('../views/SignUpView.vue'),
    },
  ],
})

export default router
