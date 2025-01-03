<script setup>
import { RouterView, useRouter } from 'vue-router'
import { ref } from 'vue'
import Dock from 'primevue/dock'
import StoreIcon from './assets/store.svg'
import GameIcon from './assets/game.svg'
import InfoIcon from './assets/info.svg'
import ExchangeIcon from './assets/exchange.svg'
import ProfileIcon from './assets/profile.svg'
import CartIcon from './assets/cart.svg'
import GuideIcon from './assets/book.svg'

const router = useRouter()

const items = ref([
  {
    label: 'Store',
    icon: StoreIcon,
    link: '/store',
  },
  {
    label: 'Library',
    icon: GameIcon,
    link: '/library',
  },
  {
    label: 'About us',
    icon: InfoIcon,
    link: '/about',
  },
  {
    label: 'Trading',
    icon: ExchangeIcon,
    link: '/trading',
  },
  {
    label: 'Guides',
    icon: GuideIcon,
    link: '/guides',
  },
  {
    label: 'Profile',
    icon: ProfileIcon,
    link: '/profile',
  },
  {
    label: 'Cart',
    icon: CartIcon,
    link: '/cart',
  },
])
</script>

<template>
  <RouterView />

  <Dock :model="items" :position="'bottom'" class="nav">
    <template #itemicon="{ item }">
      <img
        class="cursor-pointer"
        @click="router.push(item.link)"
        v-tooltip.top="item.label"
        :alt="item.label"
        :src="item.icon"
      />
    </template>
  </Dock>
</template>

<style scoped>
.nav {
  position: fixed;
  bottom: 1rem;
}
</style>
