<script setup>
import { ref, reactive, onMounted, watchEffect } from 'vue'
import { useToast } from 'primevue/usetoast'
import axios from 'axios'

const toast = useToast()

const allGames = ref([
  {
    gameName: 'Test',
    pictureShop: 'https://primefaces.org/cdn/primevue/images/card-vue.jpg',
    genres: ['Action'],
    price: 2213.13421
  }
])
const itemName = ref('');
const selectedGame = ref('');
const itemsOnSale = ref([
  {
    itemName: 'xxx',
    itemPicture: 'https://primefaces.org/cdn/primevue/images/card-vue.jpg',
    rarity: 'rare',
    price: 2213.13421,
    gameName: 'Test'
  }
]);

const filterTrigger = () => {
      axios.get("http://localhost:18124/market", {
        params: {
          gameName: selectedGame.value.gameName,
          itemName: itemName.value
        }
      }).then(response => {
        this.allSlots = response.data;
      }).catch(() => {
        toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error while getting items',
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
      <i class="pi pi-sync"></i>
      <h1 class="text-4xl">Trading</h1>
    </div>
    <div class="main-panel__content flex flex-row-reverse w-full gap-10 max-sm:flex-col">
      <aside class="filters">
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-search"></i>
          </InputGroupAddon>
          <InputText v-model="itemName" placeholder="Search item" />
        </InputGroup>

        <div class="mt-5">
          <p class="text-xl">Select game</p>
          <Listbox v-model="selectedGame" :options="allGames" optionLabel="gameName" class="w-full md:w-56" listStyle="max-height:250px">
            <template #option="slotProps">
              <div class="flex items-center">
                <img :alt="slotProps.option.gameName" :src="slotProps.option.pictureShop" class="flag mr-2" style="width: 18px" />
                <div>{{ slotProps.option.gameName }}</div>
              </div>
            </template>
          </Listbox>
        </div>
      </aside>

      <div class="w-full mt-5 grid-cols-1 grid lg:grid-cols-3 gap-5">
        <Card
          v-if="itemsOnSale.length > 0"
          class="cursor-pointer shadow-inner shadow-lg shadow-teal-500 flex flex-row"
          v-for="item in itemsOnSale"
          :key="item.itemName"
        >
          <template #header>
            <img class="img_catalog_class" v-bind:src="item.itemPicture" />
          </template>
          <template #title>
            <div class="flex gap-3">
              <p class="text-3xl">{{ item.itemName }}</p>
              <Message class="w-fit" severity="error" v-if="item.rarity === 'rare'">RARE</Message>
              <Message class="w-fit" severity="info" v-else-if="item.rarity === 'normal'">NORMAL</Message>
            </div>
          </template>
          <template #content>

            <p class="text-primary-200">from {{ item.gameName }}</p>

            <p class="m-0">
              <div class="catalog_item_price">
                <span v-if="item.price > 0" class="catalog_item_price_span">
                  {{ item.price.toFixed(2) }}$
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

<style></style>
