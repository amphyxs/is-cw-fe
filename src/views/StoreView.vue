<script setup>
import { ref, reactive, onMounted, watchEffect } from 'vue'
import axios from 'axios'
import { useToast } from 'primevue/usetoast' // Assuming you are using PrimeVue for toasts
import { useRouter } from 'vue-router'

const toast = useToast()
const router = useRouter()

const allGames = ref([
  {
    gameName: 'Test',
    pictureShop: 'https://primefaces.org/cdn/primevue/images/card-vue.jpg',
    genres: ['Action'],
    price: 2213.13421
  }
])
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

const filterTrigger = () => {
  axios
    .post('http://localhost:18124/shop/get_by_game_name_and_genres', {
      gameName: gameName.value,
      genres: selectedCategories.value,
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

watchEffect(filterTrigger)
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
          <InputText v-model="gameName" placeholder="Search" />
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

      <div class="w-full mt-5 grid-cols-1 grid lg:grid-cols-3 gap-5">
        <Card
          v-if="allGames.length > 0"
          class="cursor-pointer shadow-inner shadow-lg shadow-teal-500 flex flex-row"
          v-for="game in allGames"
          :key="game.gameName"
          @click="router.push('/game/' + game.gameName)"
        >
          <template #header>
            <img class="img_catalog_class" v-bind:src="game.pictureShop" />
          </template>
          <template #title>{{ game.gameName }}</template>
          <template #content>
            <p class="m-0">
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
            </p>
          </template>
        </Card>

        <div v-else class="text-center mt-10 text-3xl">Nothing found!</div>
      </div>
    </div>
  </div>
</template>

<style>
</style>
