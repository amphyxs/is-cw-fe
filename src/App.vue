<script setup>
import { RouterView, useRouter } from 'vue-router'
import { ref, computed, onMounted, watchEffect } from 'vue'
import Dock from 'primevue/dock'
import StoreIcon from './assets/store.svg'
import GameIcon from './assets/game.svg'
import InfoIcon from './assets/info.svg'
import ExchangeIcon from './assets/exchange.svg'
import ProfileIcon from './assets/profile.svg'
import CartIcon from './assets/cart.svg'
import GuideIcon from './assets/book.svg'
import UploadGameIcon from './assets/upload-game.svg'
import { isDraggingElementToBuy } from '@/shared/buy-elements'
import { isLoggedIn, currentAccount } from '@/shared/account'
import {
  popoverRef,
  tutorialText,
  nextTutorialStage,
  isInTutorialMode,
  onEvent,
} from '@/shared/tutorial'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'

const confirm = useConfirm()
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
    label: 'Upload game',
    icon: UploadGameIcon,
    roleNeeded: 'ROLE_DEV',
    link: '/dev/upload-game',
  },
  {
    label: 'Cart',
    icon: CartIcon,
    isCart: true,
  },
])
const bonuses = ref(0)
const isUsingBonusesToBuyGame = ref(false)
const availableItems = computed(() =>
  items.value.filter(
    (item) => !item.roleNeeded || currentAccount.value.roles.includes(item.roleNeeded),
  ),
)

const buyGame = (game) => {
  axios
    .post(
      'http://localhost:18124/game',
      {
        gameName: game.gameName,
        useBonuses: isUsingBonusesToBuyGame.value,
      },
      {
        headers: { Authorization: 'Bearer ' + currentAccount.value.token },
      },
    )
    .then(() => {
      toast.add({
        severity: 'success',
        summary: 'Game bought',
        detail: 'This game was added into your library',
        life: 3150,
      })

      getBonuses()

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
          detail: error.response.data.message,
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
        headers: { Authorization: 'Bearer ' + currentAccount.value.token },
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
          detail: error.response.data.message,
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
      showPurchaseConfirmation(element)
      setTimeout(() => document.getElementById('confirm').click(), 1)
      break
    case 'gameItem':
      buyItem(element)
      break
    default:
      console.error(`Unknow element type to buy: ${elementType}`)
      break
  }
}

const getBonuses = () => {
  axios
    .get('http://localhost:18124/user/balance', {
      headers: { Authorization: 'Bearer ' + currentAccount.value.token },
    })
    .then((response) => {
      bonuses.value = response.data.bonuses
    })
    .catch(() => {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error while getting bonuses',
        life: 3150,
      })
    })
}

const showPurchaseConfirmation = (game) => {
  getBonuses()

  confirm.require({
    target: document.getElementById('tutorial-2'),
    group: 'templating',
    message: 'Please confirm to proceed moving forward.',
    icon: 'pi pi-exclamation-circle',
    rejectProps: {
      icon: 'pi pi-times',
      label: 'Cancel',
      outlined: true,
    },
    acceptProps: {
      icon: 'pi pi-check',
      label: 'Confirm',
    },
    accept: () => {
      buyGame(game)
    },
    reject: () => {},
  })
}
</script>

<template>
  <div
    v-if="isInTutorialMode"
    class="z-50 bg-gray-950 opacity-50 w-[100vw] h-[100vh] fixed top-0"
  ></div>
  <Popover ref="popoverRef" :dismissable="false" class="max-w-64">
    <p>{{ tutorialText }}</p>
    <Button label="Got it" @click="nextTutorialStage()" />
  </Popover>
  <ConfirmPopup group="templating">
    <template #message="slotProps">
      <div
        id="confirm"
        class="flex flex-col items-center w-full gap-4 border-b border-surface-200 dark:border-surface-700 p-4 mb-4 pb-0"
      >
        <i :class="slotProps.message.icon" class="text-6xl text-primary-500"></i>
        <p>{{ slotProps.message.message }}</p>
        <div class="flex gap-2 items-center mb-5">
          <Chip
            :label="bonuses.toFixed(2)"
            icon="pi pi-plus"
            style="background-color: blueviolet"
          />
          <p>Use bonuses</p>
          <ToggleSwitch v-model="isUsingBonusesToBuyGame" />
        </div>
      </div>
    </template>
  </ConfirmPopup>

  <RouterView />

  <Dock v-if="isLoggedIn" :model="availableItems" :position="'bottom'" class="nav">
    <template #itemicon="{ item }">
      <img
        :id="item.isCart && 'tutorial-2'"
        @tutorialEvent="onEvent($event)"
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
