<script setup>
import { ref, watchEffect, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import axios from 'axios'
import { startDragElementToBuy, stopDragElementToBuy } from '@/shared/buy-elements'
import { getCurrentAccount } from '@/shared/account'
import { onEvent, isInTutorialMode } from '@/shared/tutorial'

const toast = useToast()

const allGames = ref([])
const itemName = ref('')
const selectedGame = ref(null)
const itemsOnSale = ref([])
const firstItemIndex = ref(0)
const totalItemsCount = ref(0)
const PAGE_SIZE = 10

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

const getMarketItems = () => {
  if (isInTutorialMode.value) {
    itemsOnSale.value = [
      {
        itemName: 'Prikol',
        isForTutorial: true,
      },
    ]

    return
  }

  if (!selectedGame.value) {
    return
  }

  axios
    .get('http://localhost:18125/market', {
      params: {
        gameName: selectedGame.value.name,
        itemName: itemName.value,
        page: firstItemIndex.value / PAGE_SIZE,
        size: PAGE_SIZE,
      },
    })
    .then((response) => {
      itemsOnSale.value = response.data.content
      totalItemsCount.value = response.data.totalElements
    })
    .catch(() => {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error while getting items',
        life: 3150,
      })
    })
}

onMounted(() => {
  getAllGames()
})

watchEffect(getMarketItems)
</script>

<template>
  <div class="main-panel">
    <Toast />
    <div class="main-panel__header">
      <i class="pi pi-sync"></i>
      <h1 class="text-4xl">Trading</h1>
    </div>
    <div class="main-panel__content flex flex-row-reverse w-full gap-10 max-sm:flex-col mt-4">
      <aside class="filters">
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-search"></i>
          </InputGroupAddon>
          <InputText v-model="itemName" placeholder="Search item" />
        </InputGroup>

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

      <div class="w-full">
        <template v-if="itemsOnSale.length > 0">
          <Paginator
            v-model:first="firstItemIndex"
            :rows="PAGE_SIZE"
            :totalRecords="totalItemsCount"
          ></Paginator>
          <div class="w-full mt-5 grid-cols-1 grid lg:grid-cols-3 gap-5 xl:grid-cols-4">
            <Card
              class="cursor-pointer shadow-inner shadow-lg shadow-teal-500 flex flex-row card-enter-active card-hover card-click"
              v-for="item in itemsOnSale"
              :key="item.itemName"
              draggable="true"
              @dragstart="startDragElementToBuy($event, item, 'gameItem')"
              @dragend="stopDragElementToBuy()"
            >
              <template #header>
                <div
                  class="w-full aspect-square bg-cover bg-center"
                  :style="`background-image: url(${item.itemPicture ?? NoPhoto})`"
                />
              </template>
              <template #title>
                <div class="flex gap-3">
                  <p class="text-3xl">{{ item.itemName }}</p>
                  <Message class="w-fit" severity="error" v-if="item.rarity === 'rare'"
                    >RARE</Message
                  >
                  <Message class="w-fit" severity="info" v-else-if="item.rarity === 'normal'"
                    >NORMAL</Message
                  >
                </div>
              </template>
              <template #content>
                <p class="text-primary-200">from {{ item.gameName }}</p>

                <div
                  class="m-0"
                  @tutorialEvent="onEvent($event)"
                  :id="item.isForTutorial && 'tutorial-4'"
                >
                  <div class="catalog_item_price">
                    <span v-if="item.price > 0" class="catalog_item_price_span">
                      {{ item.price.toFixed(2) }}$
                    </span>
                    <span v-else class="catalog_item_price_span">FREE</span>
                  </div>
                </div>
              </template>
            </Card>
          </div>
        </template>
        <div v-else class="text-center mt-10 text-3xl">Nothing found!</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
