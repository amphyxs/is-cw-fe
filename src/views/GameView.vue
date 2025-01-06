<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useToast } from 'primevue/usetoast' // Assuming you are using PrimeVue for toasts
import { useRouter } from 'vue-router'
import { currentAccount } from '@/shared/account'

const toast = useToast()
const router = useRouter()

const gameInfo = ref(null)
const galleriaImages = computed(() => [
  gameInfo.value.pictureGameplay1,
  gameInfo.value.pictureGameplay2,
  gameInfo.value.pictureGameplay3,
])
const gameReviews = ref([])
const newReviewText = ref('')
const newReviewRating = ref(5)
const props = defineProps(['gameName'])
const hasCurrentUserReviewForThisGame = computed(() =>
  gameReviews.value.some((review) => review.userLogin === currentAccount.value.login),
)

const getInfo = () => {
  axios
    .get(`http://localhost:18124/game/${props.gameName}`)
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
      setTimeout(() => {
        router.back()
      }, 2000)
    })
}

const getReviewRatingFromText = (text) => {
  return parseInt(text[0])
}

const getGameReviews = () => {
  axios
    .get(`http://localhost:18124/review`, {
      params: {
        selectedGame: props.gameName,
      },
    })
    .then((response) => {
      gameReviews.value = response.data
    })
    .catch(() => {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error while getting reviews',
        life: 3150,
      })
    })
}

const submitReview = () => {
  axios
    .post(
      `http://localhost:18124/review`,
      {
        gameName: props.gameName,
        reviewText: `${newReviewRating.value}/5\n${newReviewText.value}`,
      },
      {
        headers: { Authorization: 'Bearer ' + currentAccount.value.token },
      },
    )
    .then(() => {
      toast.add({
        severity: 'success',
        summary: 'Published',
        detail: 'Your review was published!',
        life: 3150,
      })
      newReviewText.value = ''
      newReviewRating.value = 5
      getGameReviews()
    })
    .catch(() => {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error while getting reviews',
        life: 3150,
      })
    })
}

onMounted(() => {
  getInfo()
  getGameReviews()
})
</script>

<template>
  <div class="main-panel">
    <Toast />
    <Skeleton v-if="!gameInfo" width="100%" height="150px"></Skeleton>
    <div
      v-else
      class="main-panel__content flex flex-row-reverse w-full gap-4 max-sm:flex-col-reverse"
    >
      <aside class="flex flex-col gap-4">
        <Card class="w-72 max-sm:w-full">
          <template #header>
            <div class="flex items-center gap-3 p-3">
              <i class="pi pi-eye"></i>
              <p class="text-2xl">Watch gameplay</p>
            </div>
          </template>
          <template #content>
            <Galleria :value="galleriaImages" :numVisible="1" containerStyle="max-width: 640px">
              <template #item="slotProps">
                <img :src="slotProps.item" alt="Gameplay preview" style="width: 100%" />
              </template>
              <template #thumbnail="slotProps">
                <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt" />
              </template>
            </Galleria>
          </template>
        </Card>
        <Card class="w-72 max-sm:w-full">
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

      <div class="w-full flex flex-col gap-4">
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
              <p><span class="text-primary">Description:</span> {{ gameInfo.gameDescription }}</p>
            </div>
          </template>
        </Card>

        <Card class="w-full">
          <template #header>
            <div class="flex items-center gap-3 p-3">
              <i class="pi pi-star"></i>
              <h2 class="text-2xl">Reviews</h2>
            </div>
          </template>
          <template #content>
            <p class="text-center" v-if="!gameReviews || gameReviews.length === 0">
              No reviews yet
            </p>
            <div class="flex gap-3 flex-wrap">
              <Card
                class="flex flex-row card-enter-active card-hover game-card w-full pt-5 pl-5"
                v-for="(review, index) in gameReviews"
                :key="index"
              >
                <template #header>
                  <Rating disabled="" :defaultValue="getReviewRatingFromText(review.reviewText)" />
                </template>
                <template #content>
                  <Inplace>
                    <template #display>{{ review.reviewText.slice(3).substr(0, 100) }}</template>
                    <template #content>
                      <p class="m-0">
                        {{ review.reviewText.slice(3) }}
                      </p>
                    </template>
                  </Inplace>
                </template>
                <template #footer>
                  <div class="flex gap-4 mt-1 max-sm:flex-col">
                    <span class="flex gap-3 items-center">
                      <i class="pi pi-calendar"></i>
                      <p>{{ review.sendDate }}</p>
                    </span>
                    <span class="flex gap-3 items-center">
                      <i class="pi pi-user"></i>
                      <p>{{ review.userLogin }}</p>
                    </span>
                  </div>
                </template>
              </Card>
            </div>
          </template>
          <template v-if="!hasCurrentUserReviewForThisGame" #footer>
            <p>Write your review</p>
            <Rating v-model="newReviewRating" />
            <Textarea class="mt-3" v-model="newReviewText" rows="5" fluid="true" />
            <Button
              :disabled="newReviewText.length === 0"
              type="button"
              severity="secondary"
              label="Submit"
              @click="submitReview()"
            />
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<style>
.game-card {
  @apply bg-primary-800 !important;
}
</style>
