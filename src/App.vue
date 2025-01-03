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

const router = useRouter()

const items = ref([
  {
    label: 'Store',
    icon: StoreIcon,
  },
  {
    label: 'Library',
    icon: GameIcon,
  },
  {
    label: 'About us',
    icon: InfoIcon,
  },
  {
    label: 'Trading',
    icon: ExchangeIcon,
  },
  {
    label: 'Profile',
    icon: ProfileIcon,
  },
  {
    label: 'Cart',
    icon: CartIcon,
  },
])
</script>

<template>
  <RouterView />

  <Dock :model="items" :position="'bottom'" class="nav">
    <template #itemicon="{ item }">
      <img
        @click="router.push('/store')"
        v-tooltip.top="item.label"
        :alt="item.label"
        :src="item.icon"
        style="width: 100%"
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
