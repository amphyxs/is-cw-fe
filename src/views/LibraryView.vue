<script setup>
import { ref, reactive, watchEffect } from 'vue'
import axios from 'axios'
import { useToast } from 'primevue/usetoast' // Assuming you are using PrimeVue for toasts
import { getCurrentAccount } from '@/shared/account'
import NoPhoto from '@/assets/no-photo.jpg'
import { onEvent, isInTutorialMode } from '@/shared/tutorial'
import { checkAchievement } from '@/shared/achievements'

const toast = useToast()

// eslint-disable-next-line no-unused-vars
const newGames = reactive([]) // TODO
const allGames = ref([])
const gameName = ref('')
const firstGameIndex = ref(0)
const totalGamesCount = ref(0)
const PAGE_SIZE = 10

const getGamesInLibrary = () => {
  if (isInTutorialMode.value) {
    allGames.value = [
      {
        gameName: 'Test',
        isForTutorial: true,
      },
    ]

    return
  }

  axios
    .get(`http://localhost:18125/library`, {
      params: {
        gameName: gameName.value,
        page: firstGameIndex.value / PAGE_SIZE,
        size: PAGE_SIZE,
      },
      headers: { Authorization: 'Bearer ' + getCurrentAccount().token },
    })
    .then((response) => {
      allGames.value = response.data.content
      totalGamesCount.value = response.data.totalElements
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
      `http://localhost:18125/library/${game}`,
      {},
      {
        headers: { Authorization: 'Bearer ' + getCurrentAccount().token },
      },
    )
    .then(() => {
      getGamesInLibrary()
    })
    .catch(() => {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error while saving your launch. Running offline',
        life: 3150,
      })
    })

  checkAchievement('Hard gamer')

  toast.add({
    severity: 'info',
    summary: 'Launching',
    life: 3150,
  })
}

const refundGame = (game) => {
  axios
    .post(
      `http://localhost:18125/library/refund`,
      {},
      {
        params: {
          gameName: game,
        },
        headers: {
          Authorization: 'Bearer ' + getCurrentAccount().token,
        },
      },
    )
    .then(() => {
      toast.add({
        severity: 'success',
        summary: 'Done',
        detail: 'The game was refunded. Money is on your balance',
        life: 3150,
      })

      getGamesInLibrary()
    })
    .catch(() => {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error while refunding the game',
        life: 3150,
      })
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
    <div class="main-panel__content flex flex-row-reverse w-full gap-10 max-sm:flex-col mt-5">
      <aside class="filters">
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-search"></i>
          </InputGroupAddon>
          <InputText v-model="gameName" placeholder="Search" />
        </InputGroup>
      </aside>

      <div class="w-full">
        <template v-if="allGames.length > 0">
          <Paginator
            v-model:first="firstGameIndex"
            :rows="PAGE_SIZE"
            :totalRecords="totalGamesCount"
          ></Paginator>

          <div class="w-full mt-5 grid-cols-1 grid lg:grid-cols-3 gap-5 xl:grid-cols-5">
            <Card
              class="cursor-pointer shadow-inner shadow-lg shadow-teal-500 flex flex-row card-hover card-click card-enter-active"
              v-for="game in allGames"
              :key="game.gameName"
            >
              <template #header>
                <div
                  class="w-full aspect-square bg-cover bg-center"
                  :style="`background-image: url(${game.pictureShop ?? NoPhoto})`"
                />
              </template>
              <template #title>{{ game.gameName }}</template>
              <template #content>
                <div v-if="!game.lastRunDate || game.lastRunDate === ''">
                  You haven't launched this game yet
                </div>
                <div v-else class="genre_class">
                  Last launch: {{ game.lastRunDate.split(' ')[0] }}
                </div>
              </template>
              <template #footer>
                <div
                  class="flex gap-2"
                  @tutorialEvent="onEvent($event)"
                  :id="game.isForTutorial && 'tutorial-3'"
                >
                  <Button
                    label=""
                    icon="pi pi-undo"
                    severity="danger"
                    outlined
                    class="w-full"
                    v-tooltip.top="'Refund'"
                    @click="refundGame(game.gameName)"
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
          </div>
        </template>
        <div v-else class="text-center mt-10 text-3xl w-full">Nothing found!</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optional hover and click styles if needed */
.card-hover:hover {
  transition: box-shadow 0.3s;
  box-shadow: 0 10px 20px rgba(102, 0, 142, 0.529);
}
</style>
