<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useToast } from 'primevue/usetoast' // Assuming you are using PrimeVue for toasts
import { currentAccount, getCurrentAccount, signOut } from '@/shared/account'
import { onEvent, isInTutorialMode } from '@/shared/tutorial'
import NoPhoto from '@/assets/no-photo.jpg'

const toast = useToast()

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
const userActivityPosts = ref([])
const newPostText = ref('')

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
  if (isInTutorialMode.value) {
    lastPlayedGames.value = [
      {
        gameName: 'Dotka',
      },
      {
        gameName: 'Cska',
      },
      {
        gameName: 'Minecruft',
      },
    ]

    return
  }

  axios
    .get(`http://localhost:18124/library/last-games/${getCurrentAccount().login}`)
    .then((response) => {
      lastPlayedGames.value = response.data.slice(0, 3)
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
  if (isInTutorialMode.value) {
    inventoryItems.value = [
      {
        itemName: 'Dotka',
        itemPicture:
          'https://static.wikia.nocookie.net/31574e74-6558-4149-9b0e-963aa476dc64/scale-to-width/755',
        isForTutorial: true,
      },
      {
        itemName: 'Cska',
        itemPicture: 'https://i.pinimg.com/736x/e2/42/bf/e242bf9e40998fdb18154168d0795804.jpg',
      },
      {
        itemName: 'Minecruft',
        itemPicture: 'https://i.redd.it/mdpn1df7kkk91.jpg',
      },
    ]

    return
  }

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

const enterGame = (game) => {
  axios
    .patch(
      `http://localhost:18124/library/${game}`,
      {},
      {
        headers: { Authorization: 'Bearer ' + getCurrentAccount().token },
      },
    )
    .catch(() => {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error while saving your launch. Running offline',
        life: 3150,
      })
    })

  toast.add({
    severity: 'info',
    summary: 'Launching',
    life: 3150,
  })
}

const getUserActivityPosts = () => {
  axios
    .get('http://localhost:18124/activity', {
      params: {
        login: currentAccount.value.login,
      },
      headers: { Authorization: 'Bearer ' + getCurrentAccount().token },
    })
    .then((response) => {
      userActivityPosts.value = response.data
    })
    .catch(() => {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error while getting user activity posts',
        life: 3150,
      })
    })
}

const submitUserActivityPost = () => {
  axios
    .post(
      'http://localhost:18124/activity',
      {
        text: newPostText.value,
      },
      {
        headers: { Authorization: 'Bearer ' + getCurrentAccount().token },
      },
    )
    .then(() => {
      toast.add({
        severity: 'success',
        summary: 'Posted',
        detail: 'New post was successfully added to your activity!',
        life: 3150,
      })
      getUserActivityPosts()
      newPostText.value = ''
    })
    .catch(() => {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error while getting user activity posts',
        life: 3150,
      })
    })
}

onMounted(() => {
  getAccountInfo()
  getLastPlayedGames()
  getGamesCount()
  getBalanceAmount()
  getInvenotoryItems()
  getUserActivityPosts()
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
          <template #footer>
            <Button class="w-full" severity="danger" label="Sign out" @click="signOut()" />
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
            <div @tutorialEvent="onEvent($event)" :id="'tutorial-7'">
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
            </div>
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
                class="game-card w-full cursor-pointer card-enter-active card-click card-hover"
              >
                <template #header>
                  <div
                    class="w-full aspect-square bg-cover bg-center"
                    :style="`background-image: url(${game.shopPicture ?? NoPhoto})`"
                  />
                </template>
                <template #content>
                  <p>{{ game.gameName }}</p>
                </template>
                <template #footer>
                  <Button
                    label="Launch"
                    icon="pi pi-play"
                    class="w-full"
                    severity="secondary"
                    @click="enterGame(game.gameName)"
                  />
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
                class="cursor-pointer w-36 h-36 card-enter-active card-click card-hover"
                draggable="true"
                @dragstart="startDragInventoryItem($event, item)"
                @dragend="isDraggingInventoryItem = false"
                @tutorialEvent="onEvent($event)"
                :id="item.isForTutorial && 'tutorial-6'"
              />
            </div>
          </template>
        </Card>

        <Card class="w-full">
          <template #header>
            <div class="flex items-center gap-3 p-3">
              <i class="pi pi-book"></i>
              <h2 class="text-2xl">Your activity</h2>
            </div>
          </template>
          <template #content>
            <p class="text-center" v-if="!userActivityPosts || userActivityPosts.length === 0">
              Start writing posts
            </p>
            <div class="flex gap-3 flex-wrap">
              <Card
                class="flex flex-row card-enter-active card-hover game-card w-full"
                v-for="(post, index) in userActivityPosts"
                :key="index"
              >
                <template #content>
                  <Inplace>
                    <template #display>{{ post.text.substr(0, 100) }}</template>
                    <template #content>
                      <p class="m-0">
                        {{ post.text }}
                      </p>
                    </template>
                  </Inplace>
                </template>
                <template #footer>
                  <div class="flex gap-4 mt-1 max-sm:flex-col">
                    <span class="flex gap-3 items-center">
                      <i class="pi pi-calendar"></i>
                      <p>{{ post.sendDate }}</p>
                    </span>
                  </div>
                </template>
              </Card>
            </div>
          </template>
          <template #footer>
            <p>New post</p>
            <Textarea v-model="newPostText" rows="5" fluid="true" />
            <Button
              :disabled="newPostText.length === 0"
              type="button"
              severity="secondary"
              label="Submit"
              @click="submitUserActivityPost()"
            />
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<style>
.game-card {
  @apply bg-primary-800 !important;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Define the transition itself */
.card-enter-active {
  animation: fadeInUp 0.5s ease-out;
}

/* Optional hover and click styles if needed */
.card-hover:hover {
  transform: scale(1.05);
  transition: transform 0.3s;
  box-shadow: 0 10px 20px rgba(102, 0, 142, 0.529);
}

.card-click:active {
  transform: scale(0.95);
  transition: transform 0.1s;
}
</style>
