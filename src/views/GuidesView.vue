<script setup>
import { ref, onMounted, watchEffect } from 'vue'
import { useToast } from 'primevue/usetoast'
import axios from 'axios'
import { getCurrentAccount } from '@/shared/account'
import { onEvent } from '@/shared/tutorial'

const toast = useToast()

const PAGE_SIZE = 10
const allGuides = ref([])
const allGames = ref([])
const selectedGame = ref(null)
const guideText = ref('')
const firstGuideIndex = ref(0)
const totalGuidesCount = ref(0)

const getAllGames = () => {
  axios
    .get('http://localhost:18125/game', {
      headers: { Authorization: 'Bearer ' + getCurrentAccount().token },
    })
    .then((response) => {
      allGames.value = response.data
      selectedGame.value = allGames.value?.length > 0 ? allGames.value[0] : null
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
  if (!selectedGame.value?.name) {
    return
  }

  axios
    .get('http://localhost:18125/guide', {
      params: {
        selectedGame: selectedGame.value.name,
        page: Math.floor(firstGuideIndex.value / PAGE_SIZE),
        size: PAGE_SIZE,
      },
    })
    .then((response) => {
      allGuides.value = response.data.content
      totalGuidesCount.value = response.data.totalElements
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
      'http://localhost:18125/guide',
      {
        gameName: selectedGame.value.name,
        guideText: guideText.value,
      },
      {
        headers: { Authorization: 'Bearer ' + getCurrentAccount().token },
      },
    )
    .then(() => {
      toast.add({
        severity: 'success',
        summary: 'Published',
        detail: 'Your guide was published!',
        life: 3150,
      })
      guideText.value = ''
      getAllGuidesBySelectedGame()
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
  getAllGames()
})
</script>

<template>
  <div class="main-panel" @tutorialEvent="onEvent($event)" :id="'tutorial-5'">
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
                <div>{{ slotProps.option.name }}</div>
              </div>
            </template>
          </Listbox>
        </div>
      </aside>

      <div class="w-full mt-5 grid-cols-1 grid gap-5">
        <div v-if="selectedGame && selectedGame !== ''">
          <p>Write your guide</p>
          <Textarea v-model="guideText" rows="5" fluid="true" />
          <Button
            :disabled="guideText.length === 0"
            type="button"
            severity="secondary"
            label="Submit"
            @click="submitGuide()"
          />
        </div>

        <template v-if="allGuides.length > 0">
          <Paginator
            v-model:first="firstGuideIndex"
            :rows="PAGE_SIZE"
            :totalRecords="totalGuidesCount"
          ></Paginator>

          <Card
            class="flex flex-row card-enter-active card-hover"
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
        </template>
        <div v-else-if="!selectedGame" class="text-center mt-10 text-3xl">
          Select game to show guides
        </div>
        <div v-else class="text-center mt-10 text-3xl">Nothing found!</div>
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

.card-click:active {
  transform: scale(0.95);
  transition: transform 0.1s;
}
</style>
