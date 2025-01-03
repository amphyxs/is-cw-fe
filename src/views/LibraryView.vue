<script setup>
import { ref, reactive, onMounted, watchEffect } from 'vue'
import axios from 'axios'
import { useToast } from 'primevue/usetoast' // Assuming you are using PrimeVue for toasts
import { useRouter } from 'vue-router'

const toast = useToast()
const router = useRouter()

const newGames = reactive([]) // TODO

const allGames = ref([
  {
    gameName: 'Test',
    pictureShop: 'https://primefaces.org/cdn/primevue/images/card-vue.jpg',
    genres: ['Action'],
    price: 2213.13421,
  },
])
const gameName = ref('')

const filterTrigger = () => {
  axios
    .post(
      'http://localhost:18124/library/get_by_game_name_library',
      {
        game_name: gameName.value,
      },
      {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('jwt') },
      },
    )
    .then((response) => {
      this.allGames = response.data
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error while getting games',
        life: 3150,
      })
    })
}

const enterGame = (game) => {
  axios.post(
    'http://localhost:18124/library/enter_game',
    {
      game_name: game,
    },
    {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('jwt') },
    },
  )

  toast.add({
    severity: 'info',
    summary: 'Launching',
    life: 3150,
  })
}

watchEffect(filterTrigger)
</script>

<template>
  <div class="main-panel">
    <Toast />
    <div class="main-panel__header">
      <i class="pi pi-bars"></i>
      <h1 class="text-4xl">Library</h1>
    </div>
    <div class="main-panel__content flex flex-row-reverse w-full gap-10 max-sm:flex-col">
      <aside class="filters">
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-search"></i>
          </InputGroupAddon>
          <InputText v-model="gameName" placeholder="Search" />
        </InputGroup>
      </aside>

      <div class="w-full mt-5 grid-cols-1 grid lg:grid-cols-3 gap-5">
        <Card
          v-if="allGames.length > 0"
          class="cursor-pointer shadow-inner shadow-lg shadow-teal-500 flex flex-row"
          v-for="game in allGames"
          :key="game.gameName"
        >
          <template #header>
            <img class="img_catalog_class" v-bind:src="game.pictureShop" />
          </template>
          <template #title>{{ game.gameName }}</template>
          <template #content>
            <div v-if="!game.last_run_date || game.last_run_date === ''">
              You haven't launch this game yet
            </div>
            <div v-else class="genre_class">Last launch: {{ game.last_run_date }}</div>
          </template>
          <template #footer>
            <div class="flex gap-2">
              <Button
                label=""
                icon="pi pi-undo"
                severity="danger"
                outlined
                class="w-full"
                v-tooltip.top="'Refund'"
              />
              <Button
                label="Launch"
                icon="pi pi-play"
                class="w-full"
                @click="enterGame(game.gameName)"
              />
            </div>
          </template>
        </Card>

        <div v-else class="text-center mt-10 text-3xl">Nothing found!</div>
      </div>
    </div>
  </div>
</template>

<style>
.filters {
}
</style>
