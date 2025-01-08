<script setup>
import { ref, watchEffect } from 'vue'
import axios from 'axios'
import { useToast } from 'primevue/usetoast' // Assuming you are using PrimeVue for toasts
import { useRouter } from 'vue-router'
import { startDragElementToBuy, stopDragElementToBuy } from '@/shared/buy-elements'
import { onEvent } from '@/shared/tutorial'

const toast = useToast()
const router = useRouter()

const allGames = ref([])
const gameName = ref('')
const selectedCategories = ref([])
const categories = ref([
  { name: 'Action', key: 'action' },
  { name: 'Strategy', key: 'strategy' },
  { name: 'Racing', key: 'racing' },
  { name: 'Casual', key: 'casual' },
  { name: 'RPG', key: 'rpg' },
  { name: 'Simulator', key: 'sim' },
  { name: 'Adventures', key: 'adventures' },
  { name: 'Sport', key: 'sport' },
])

const getGames = () => {
  axios
    .get('http://localhost:18125/shop', {
      params: {
        gameName: gameName.value,
        genres: selectedCategories.value.length > 0 ? selectedCategories.value : '',
      },
      paramsSerializer: {
        indexes: null,
      },
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

watchEffect(getGames)
</script>

<template>
  <div class="main-panel">
    <Toast />
    <div class="main-panel__header">
      <i class="pi pi-shop"></i>
      <h1 class="text-4xl">Store</h1>
    </div>
    <div class="main-panel__content flex flex-row-reverse w-full gap-10 max-sm:flex-col">
      <aside class="filters">
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-search"></i>
          </InputGroupAddon>
          <InputText v-model="gameName" placeholder="Search" class="input-focus" />
        </InputGroup>

        <div class="mt-5">
          <p class="text-xl">Categories</p>
          <div v-for="category of categories" :key="category.key" class="flex items-center gap-2">
            <Checkbox
              v-model="selectedCategories"
              :inputId="category.key"
              name="category"
              :value="category.name"
            />
            <label :for="category.key">{{ category.name }}</label>
          </div>
        </div>
      </aside>

      <div class="w-full mt-5 grid-cols-1 grid lg:grid-cols-3 gap-5 xl:grid-cols-5">
        <template v-if="allGames.length > 0">
          <Card
            class="cursor-pointer shadow-inner shadow-lg shadow-teal-500 flex flex-row card-hover card-click card-enter-active"
            v-for="(game, index) in allGames"
            :key="game.gameName"
            @click="router.push('/game/' + game.gameName)"
            draggable="true"
            @dragstart="startDragElementToBuy($event, game, 'game')"
            @dragend="stopDragElementToBuy()"
          >
            <template #header>
              <div
                class="w-full aspect-square bg-cover bg-center"
                :style="`background-image: url(${game.pictureShop})`"
              />
            </template>
            <template #title>{{ game.gameName }}</template>
            <template #content>
              <div class="m-0" :id="index === 1 && 'tutorial-1'" @tutorialEvent="onEvent($event)">
                <div class="catalog_item_name">
                  <div class="catalog_item_name_genre">
                    <div class="genre_class">{{ game.genres.join(', ') }}</div>
                  </div>
                </div>

                <div class="catalog_item_price">
                  <span v-if="game.price > 0" class="catalog_item_price_span">
                    {{ game.price.toFixed(2) }}$
                  </span>

                  <span v-else class="catalog_item_price_span">FREE</span>
                </div>
              </div>
            </template>
          </Card>
        </template>
        <div v-else class="text-center mt-10 text-3xl">Nothing found!</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-hover:hover {
  transform: scale(1.05);
  transition: transform 0.3s;
  box-shadow: 0 10px 20px rgba(141, 0, 250, 0.372);
}

.card-click:active {
  transform: scale(0.95);
  transition: transform 0.1s;
}

.input-focus:focus {
  border-color: teal;
  box-shadow: 0 0 10px rgba(0, 128, 128, 0.5);
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
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
</style>
