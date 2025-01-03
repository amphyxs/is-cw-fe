<script setup>
import { ref, reactive, onMounted, watchEffect } from 'vue'
import { useToast } from 'primevue/usetoast'
import axios from 'axios'

const toast = useToast()

const allGuides = ref([
  {
    gameName: 'Test',
    guideText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    userLogin: 'Action',
    sendDate: 2213.13421,
  },
  {
    gameName: 'Test',
    guideText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    userLogin: 'Action',
    sendDate: 2213.13421,
  },
  {
    gameName: 'Test',
    guideText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    userLogin: 'Action',
    sendDate: 2213.13421,
  },
  {
    gameName: 'Test',
    guideText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    userLogin: 'Action',
    sendDate: 2213.13421,
  },
  {
    gameName: 'Test',
    guideText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    userLogin: 'Action',
    sendDate: 2213.13421,
  },
])
const allGames = ref([
  {
    gameName: 'Test',
    pictureShop: 'https://primefaces.org/cdn/primevue/images/card-vue.jpg',
    genres: ['Action'],
    price: 2213.13421,
  },
])
const selectedGame = ref('')
const guideText = ref('')

const getAllGamesByLogin = () => {
  axios
    .get('http://localhost:18124/game/get_all_games_by_login', {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('jwt') },
    })
    .then((response) => {
      this.allGames = response.data
    })
    .catch(() => {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error while getting games',
        life: 3150,
      })
    })
}

const getAllGuidesBySelectedGame = () => {
  axios
    .post('http://localhost:18124/guide/get_guides_by_selected_game', {
      selected_game_to_show: selectedGame.value,
    })
    .then((response) => {
      this.allGuides = response.data
    })
    .catch(() => {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error while getting guides',
        life: 3150,
      })
    })
}

const submitGuide = () => {
  axios
    .post(
      'http://localhost:18124/guide/add_guide',
      {
        game_name: selectedGame.value.gameName,
        guide_text: guideText.value,
      },
      {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('jwt') },
      },
    )
    .then((response) => {
      this.allGuides = response.data
      toast.add({
        severity: 'success',
        summary: 'Published',
        detail: 'Your guide was published!',
        life: 3150,
      })
      guideText.value = ''
    })
    .catch(() => {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error while publishing guide',
        life: 3150,
      })
    })
}

watchEffect(getAllGuidesBySelectedGame)

onMounted(() => {
  getAllGamesByLogin()
})
</script>

<template>
  <div class="main-panel">
    <Toast />
    <div class="main-panel__header">
      <i class="pi pi-book"></i>
      <h1 class="text-4xl">Guides</h1>
    </div>
    <div class="main-panel__content flex flex-row-reverse w-full gap-10 max-sm:flex-col">
      <aside class="filters">
        <div class="mt-5">
          <p class="text-xl">Select game</p>
          <Listbox
            v-model="selectedGame"
            :options="allGames"
            optionLabel="gameName"
            class="w-full md:w-56"
            listStyle="max-height:250px"
          >
            <template #option="slotProps">
              <div class="flex items-center">
                <img
                  :alt="slotProps.option.gameName"
                  :src="slotProps.option.pictureShop"
                  class="flag mr-2"
                  style="width: 18px"
                />
                <div>{{ slotProps.option.gameName }}</div>
              </div>
            </template>
          </Listbox>
        </div>
      </aside>

      <div class="w-full mt-5 grid-cols-1 grid gap-5">
        <div v-if="selectedGame && selectedGame !== ''">
          <p>Write your guide</p>
          <Textarea v-model="guideText" rows="5" fluid="true" />
          <Button type="button" severity="secondary" label="Submit" @click="submitGuide()" />
        </div>

        <Card
          v-if="allGuides.length > 0"
          class="cursor-pointer shadow-inner shadow-lg shadow-teal-500 flex flex-row"
          v-for="(guide, index) in allGuides"
          :key="index"
        >
          <template #content>
            <Inplace>
              <template #display>{{ guide.guideText.substr(0, 100) }}</template>
              <template #content>
                <p class="m-0">
                  {{ guide.guideText }}
                </p>
              </template>
            </Inplace>
          </template>
          <template #footer>
            <div class="flex gap-4 mt-1 max-sm:flex-col">
              <span class="flex gap-3 items-center">
                <i class="pi pi-user"></i>
                <p>{{ guide.userLogin }}</p>
              </span>
              <span class="flex gap-3 items-center">
                <i class="pi pi-calendar"></i>
                <p>{{ guide.sendDate }}</p>
              </span>
              <span class="flex gap-3 items-center">
                <i class="pi pi-play"></i>
                <p>{{ guide.gameName }}</p>
              </span>
            </div>
          </template>
        </Card>

        <div v-else class="text-center mt-10 text-3xl">Nothing found!</div>
      </div>
    </div>
  </div>
</template>

<style></style>
