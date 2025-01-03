<script setup>
import { ref, onMounted, watchEffect } from 'vue'
import { useToast } from 'primevue/usetoast'
import axios from 'axios'

const toast = useToast()
</script>

<template>
  <div class="main-panel">
    <Toast />
    <div class="main-panel__header">
      <i class="pi pi-shopping-cart"></i>
      <h1 class="text-4xl">Cart</h1>
    </div>
    <div class="main-panel__content flex flex-col w-full gap-10">
      <div>
        <h2 class="text-2xl">Games</h2>
        <Card
          v-if="gamesToSell && gamesToSell.length > 0"
          class="cursor-pointer shadow-inner shadow-lg shadow-teal-500 flex flex-row"
          v-for="game in gamesToSell"
          :key="game.gameName"
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
          <template #footer>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<style></style>
