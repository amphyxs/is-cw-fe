<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useToast } from 'primevue/usetoast' // Assuming you are using PrimeVue for toasts
import { useRouter } from 'vue-router'
import { getCurrentAccount } from '@/shared/account'
import NoPhoto from '@/assets/no-photo.jpg'

const toast = useToast()
const router = useRouter()

const gamesCount = ref(0)
const lastLoginDate = ref('')
const registrationDate = ref('')
const balance = ref(0)
const moneyToAdd = ref(0)
const priceForSellingItem = ref(0)
const itemForSale = ref(null)
const isAddingMoney = ref(false)
const isDraggingInventoryItem = ref(false)
const isSellingItem = ref(false)
const inventoryItems = ref([])
const lastPlayedGames = ref([])

const addMoneyOnBalance = () => {
  isAddingMoney.value = false

  axios
    .post(
      'http://localhost:18124/user/balance-add',
      {
        balance: moneyToAdd.value,
      },
      {
        headers: { Authorization: 'Bearer ' + getCurrentAccount().token },
      },
    )
    .then(() => {
      getBalanceAmount()
    })
    .catch(() => {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error while charging money',
        life: 3150,
      })
    })
}

const startDragInventoryItem = (evt, item) => {
  evt.dataTransfer.dropEffect = 'move'
  evt.dataTransfer.effectAllowed = 'move'
  itemForSale.value = item
  isDraggingInventoryItem.value = true
}

const getAccountInfo = () => {
  axios
    .get(`http://localhost:18124/user/status-dates/${getCurrentAccount().login}`)
    .then((response) => {
      registrationDate.value = response.data.registrationDate
      lastLoginDate.value = response.data.lastLoginDate
    })
    .catch(() => {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error while getting account info',
        life: 3150,
      })
    })
}

const getGamesCount = () => {
  axios
    .get(`http://localhost:18124/library/count/${getCurrentAccount().login}`)
    .then((response) => {
      gamesCount.value = response.data
    })
    .catch(() => {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error while getting games count',
        life: 3150,
      })
    })
}

const getLastPlayedGames = () => {
  axios
    .get(`http://localhost:18124/library/last-games/${getCurrentAccount().login}`)
    .then((response) => {
      lastPlayedGames.value = response.data
    })
    .catch(() => {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error while getting last played games',
        life: 3150,
      })
    })
}

const getBalanceAmount = () => {
  axios
    .get('http://localhost:18124/user/balance', {
      headers: { Authorization: 'Bearer ' + getCurrentAccount().token },
    })
    .then((response) => {
      balance.value = response.data.balance
    })
    .catch(() => {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error while getting balance',
        life: 3150,
      })
    })
}

const getInvenotoryItems = () => {
  axios
    .get('http://localhost:18124/inventory', {
      headers: { Authorization: 'Bearer ' + getCurrentAccount().token },
    })
    .then((response) => {
      inventoryItems.value = response.data
    })
    .catch(() => {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error while getting inventory items',
        life: 3150,
      })
    })
}

const sellPickedInventoryItem = () => {
  isSellingItem.value = false

  axios
    .post(
      'http://localhost:18124/market/sell',
      {
        gameName: itemForSale.value.gameName,
        itemName: itemForSale.value.itemName,
        rarity: itemForSale.value.rarity,
        price: priceForSellingItem.value,
      },
      {
        headers: { Authorization: 'Bearer ' + getCurrentAccount().token },
      },
    )
    .then(() => {
      toast.add({
        severity: 'success',
        summary: 'Start trading',
        detail: 'Your items was published on trading floor!',
        life: 3150,
      })
    })
    .catch(() => {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error while publishing your item on trading floor',
        life: 3150,
      })
    })

  getInvenotoryItems()
}

onMounted(() => {
  getAccountInfo()
  getLastPlayedGames()
  getGamesCount()
  getBalanceAmount()
  getInvenotoryItems()
})
</script>

<template>
  <Dialog v-model:visible="isSellingItem" modal header="Sell item" :style="{ width: '25rem' }">
    <div class="flex-auto">
      <label for="price-for-item" class="font-bold block mb-2">Price you want to get</label>
      <InputNumber
        v-model="priceForSellingItem"
        inputId="price-for-item"
        mode="currency"
        currency="USD"
        locale="en-US"
        :min="0"
        :max="1000000"
        fluid
      />
    </div>
    <template #footer>
      <Button type="button" severity="primary" label="Sell" @click="sellPickedInventoryItem()" />
    </template>
  </Dialog>

  <Dialog v-model:visible="isAddingMoney" modal header="Add money" :style="{ width: '25rem' }">
    <template #header>
      <p class="text-2xl">Checkout</p>
    </template>
    <div class="flex-auto">
      <label for="money-to-add" class="font-bold block mb-2">Money amount</label>
      <InputNumber
        v-model="moneyToAdd"
        inputId="money-to-add"
        mode="currency"
        currency="USD"
        locale="en-US"
        :min="0"
        :max="500"
        fluid
      />
    </div>
    <template #footer>
      <Button
        type="button"
        severity="primary"
        label="Proceed to checkout"
        @click="addMoneyOnBalance()"
      />
    </template>
  </Dialog>

  <div class="main-panel">
    <Toast />
    <div class="main-panel__header">
      <i class="pi pi-sparkles"></i>
      <h1 class="text-4xl">Welcome back!</h1>
    </div>
    <div
      class="main-panel__content flex flex-row-reverse w-full gap-3 max-sm:flex-col-reverse mt-10"
    >
      <aside class="flex flex-col gap-3 flex-1">
        <Card class="w-full">
          <template #header>
            <div class="flex items-center p-3">
              <Avatar icon="pi pi-user" class="mr-2" size="large" shape="circle" />
              <p class="text-2xl">{{ getCurrentAccount().login }}</p>
            </div>
          </template>
          <template #content>
            <p>Games on account: {{ gamesCount }}</p>
            <p>Registration date: {{ registrationDate }}</p>
            <p>Last login date: {{ lastLoginDate }}</p>
          </template>
        </Card>

        <Card class="w-full">
          <template #header>
            <div class="flex items-center gap-3 p-3">
              <i class="pi pi-wallet"></i>
              <p class="text-2xl">Wallet</p>
            </div>
          </template>
          <template #content>
            <p class="text-xl mb-10">{{ balance }}$</p>
            <Button
              class="w-full mb-3"
              type="button"
              severity="primary"
              label="Add money"
              @click="isAddingMoney = true"
            />
            <Button
              class="w-full item-sell-zone"
              type="button"
              :disabled="!isDraggingInventoryItem"
              :severity="isDraggingInventoryItem ? 'primary' : 'secondary'"
              label="Drop item here to sell"
              @drop="isSellingItem = true"
              @dragover.prevent
              @dragenter.prevent
            />
          </template>
        </Card>
      </aside>

      <div class="w-full flex flex-col gap-3 flex-[2]">
        <Card class="w-full">
          <template #header>
            <div class="flex items-center gap-3 p-3">
              <i class="pi pi-play"></i>
              <h2 class="text-2xl">Recently played</h2>
            </div>
          </template>
          <template #content>
            <p v-if="!lastPlayedGames || lastPlayedGames.length === 0" class="text-center">
              You haven't played any games yet
            </p>
            <div v-else class="grid grid-cols-3 gap-3 max-sm:grid-cols-1">
              <Card
                v-for="game of lastPlayedGames"
                v-bind:key="game.gameName"
                class="game-card w-full cursor-pointer"
                @click="router.push('/game/' + game.gameName)"
              >
                <template #header>
                  <img :src="game.shopPicture ?? NoPhoto" :alt="game.gameName" />
                </template>
                <template #content>
                  <p>{{ game.gameName }}</p>
                </template>
              </Card>
            </div>
          </template>
        </Card>

        <Card class="w-full">
          <template #header>
            <div class="flex items-center gap-3 p-3">
              <i class="pi pi-box"></i>
              <h2 class="text-2xl">Your inventory</h2>
            </div>
          </template>
          <template #content>
            <p class="text-center" v-if="!inventoryItems || inventoryItems.length === 0">
              Inventory is empty
            </p>
            <div class="flex gap-3 flex-wrap">
              <img
                :src="item.itemPicture"
                :alt="item.itemName"
                v-for="item of inventoryItems"
                v-bind:key="item.itemName"
                class="cursor-pointer w-36 h-36"
                draggable="true"
                @dragstart="startDragInventoryItem($event, item)"
                @dragend="isDraggingInventoryItem = false"
              />
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<style>
.game-card {
  @apply bg-primary-800;
}
</style>
