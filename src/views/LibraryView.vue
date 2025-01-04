<script setup>
import { ref, reactive, watchEffect } from 'vue'
import axios from 'axios'
import { useToast } from 'primevue/usetoast' // Assuming you are using PrimeVue for toasts
import { getCurrentAccount } from '@/shared/account'
import NoPhoto from '@/assets/no-photo.jpg'

const toast = useToast()

// eslint-disable-next-line no-unused-vars
const newGames = reactive([]) // TODO
const allGames = ref([])
const gameName = ref('')

const getGamesInLibrary = () => {
  axios
    .get(`http://localhost:18124/library`, {
      params: {
        gameName: gameName.value,
      },
      headers: { Authorization: 'Bearer ' + getCurrentAccount().token },
    })
    .then((response) => {
      allGames.value = response.data
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

watchEffect(getGamesInLibrary)
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
        <template v-if="allGames.length > 0">
          <Card
            class="cursor-pointer shadow-inner shadow-lg shadow-teal-500 flex flex-row"
            v-for="game in allGames"
            :key="game.gameName"
          >
            <template #header>
              <img
                class="img_catalog_class"
                v-bind:src="game.pictureShop ?? NoPhoto"
                alt="Game preview"
              />
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
        </template>
        <div v-else class="text-center mt-10 text-3xl">Nothing found!</div>
      </div>
    </div>
  </div>
</template>

<style>
.filters {
}
</style>
