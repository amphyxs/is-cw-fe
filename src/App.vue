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
import { isDraggingElementToBuy } from '@/shared/buy-elemets'
import { isLoggedIn } from '@/shared/account'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
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
    link: '/account',
  },
  {
    label: 'Cart',
    icon: CartIcon,
    isCart: true,
  },
])

const buyGame = (game) => {
  axios
    .post(
      'http://localhost:18124/game/buy_game',
      {
        game_name: game.gameName,
      },
      {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('jwt') },
      },
    )
    .then(() => {
      toast.add({
        severity: 'success',
        summary: 'Game bought',
        detail: 'This game was added into your library',
        life: 3150,
      })

      router.push('/library')
    })
    .catch((error) => {
      if (error?.response?.status === 401) {
        toast.add({
          severity: 'error',
          summary: 'Auth required',
          detail: 'You must be authorized before buying games',
          life: 3150,
        })
      } else if (error?.response?.status === 403) {
        toast.add({
          severity: 'error',
          summary: 'You are developer',
          detail: "Developers can't buy games",
          life: 3150,
        })
      } else {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error while buying game',
          life: 3150,
        })
      }
    })
}

const buyItem = (item) => {
  axios
    .post(
      'http://localhost:18124/market/buy',
      {
        gameName: item.gameName,
        itemName: item.itemName,
        rarity: item.rarity,
        marketId: item.marketId,
      },
      {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('jwt') },
      },
    )
    .then(() => {
      toast.add({
        severity: 'success',
        summary: 'Item bought',
        detail: 'This item was added into your library',
        life: 3150,
      })

      router.push('/account')
    })
    .catch((error) => {
      if (error?.response?.status === 401) {
        toast.add({
          severity: 'error',
          summary: 'Auth required',
          detail: 'You must be authorized before buying items',
          life: 3150,
        })
      } else if (error?.response?.status === 403) {
        toast.add({
          severity: 'error',
          summary: 'You are developer',
          detail: "Developers can't buy items",
          life: 3150,
        })
      } else {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error while buying item',
          life: 3150,
        })
      }
    })
}

const onDropElementToBuy = (evt) => {
  const element = JSON.parse(evt.dataTransfer.getData('element'))
  const elementType = evt.dataTransfer.getData('elementType')

  switch (elementType) {
    case 'game':
      buyGame(element)
      break
    case 'gameItem':
      buyItem(element)
      break
    default:
      console.error(`Unknow element type to buy: ${elementType}`)
      break
  }
}
</script>

<template>
  <RouterView />

  <Dock v-if="isLoggedIn()" :model="items" :position="'bottom'" class="nav">
    <template #itemicon="{ item }">
      <img
        class="cursor-pointer"
        :class="item.isCart && !isDraggingElementToBuy && 'opacity-25'"
        @click="!item.isCart && router.push(item.link)"
        v-tooltip.top="item.label"
        :alt="item.label"
        :src="item.icon"
        @drop="item.isCart && onDropElementToBuy($event)"
        @dragover.prevent
        @dragenter.prevent
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
