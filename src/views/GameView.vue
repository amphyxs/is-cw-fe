<script setup>
import { ref, reactive, onMounted, watchEffect } from 'vue'
import axios from 'axios'
import { useToast } from 'primevue/usetoast' // Assuming you are using PrimeVue for toasts
import { useRouter } from 'vue-router'

const toast = useToast()
const router = useRouter()

const gameInfo = ref({
  price: 100.0,
  genres: ['Action', 'Adventure'],
  developmentDate: new Date(),
  devLogin: 'Alex',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  pictureCover: 'https://primefaces.org/cdn/primevue/images/card-vue.jpg',
  sliderItems: [
    'https://primefaces.org/cdn/primevue/images/card-vue.jpg',
    'https://primefaces.org/cdn/primevue/images/card-vue.jpg',
    'https://primefaces.org/cdn/primevue/images/card-vue.jpg',
  ],
})
const props = defineProps(['gameName'])

const getInfo = () => {
  axios
    .post('http://localhost:18124/game/get_game_info', {
      game_name: props.gameName,
    })
    .then((response) => {
      gameInfo.value = response.data
    })
    .catch(() => {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error while getting game',
        life: 3150,
      })
      router.back()
    })
}

onMounted(() => {
  getInfo()
})
</script>

<template>
  <div class="main-panel">
    <Toast />
    <div class="main-panel__content flex flex-row-reverse w-full gap-4 max-sm:flex-col">
      <aside class="flex flex-col gap-4">
        <Card class="w-72">
          <template #header>
            <div class="flex items-center gap-3 p-3">
              <i class="pi pi-eye"></i>
              <p class="text-2xl">Watch gameplay</p>
            </div>
          </template>
          <template #content>
            <Galleria
              :value="gameInfo.sliderItems"
              :numVisible="1"
              containerStyle="max-width: 640px"
            >
              <template #item="slotProps">
                <img :src="slotProps.item" alt="Gameplay preview" style="width: 100%" />
              </template>
              <template #thumbnail="slotProps">
                <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt" />
              </template>
            </Galleria>
          </template>
        </Card>
        <Card class="w-72">
          <template #header>
            <div class="flex items-center gap-3 p-3">
              <i class="pi pi-wallet"></i>
              <p class="text-2xl">Buy this game</p>
            </div>
          </template>
          <template #content>
            <p class="text-lg"><span class="text-primary">Price:</span> {{ gameInfo.price }}$</p>
          </template>
          <template #footer>
            <Button label="Visit store" @click="router.push('/store')"></Button>
          </template>
        </Card>
      </aside>
      <Card class="w-full">
        <template #header>
          <div
            class="h-64 bg-cover bg-clip-content bg-center"
            :style="`background-image: url(${gameInfo.pictureCover});`"
          />
          <p class="text-3xl text-primary p-5">{{ props.gameName }}</p>
        </template>
        <template #content>
          <div class="flex items-center gap-2">
            <i class="pi pi-compass text-primary"></i>
            <p><span class="text-primary">Genres:</span> {{ gameInfo.genres.join(', ') }}</p>
          </div>
          <div class="flex items-center gap-2">
            <i class="pi pi-calendar text-primary"></i>
            <p>
              <span class="text-primary">Development date:</span> {{ gameInfo.developmentDate }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <i class="pi pi-user text-primary"></i>
            <p><span class="text-primary">Developer:</span> {{ gameInfo.devLogin }}</p>
          </div>
          <div class="flex items-center gap-2">
            <i class="pi pi-book text-primary"></i>
            <p><span class="text-primary">Description:</span> {{ gameInfo.description }}</p>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<style></style>
