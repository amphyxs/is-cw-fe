<script setup>
import MainPageImage from '../assets/main-page-banner.jpg'
</script>

<template>
  <img :src="MainPageImage" alt="Par" class="banner w-full" />

  <div class="card flex flex-col items-center mt-5">
    <div class="flex flex-col items-center gap-2">
      <span class="text-xl font-medium text-primary">Learn about our store</span>
      <span
        class="slidedown-icon h-8 w-8 bg-primary text-primary-contrast rounded-full inline-flex items-center justify-center"
      >
        <i class="pi pi-arrow-down" />
      </span>
    </div>
    <div class="h-[30rem]"></div>
    <div
      v-animateonscroll="{ enterClass: 'animate-fadein', leaveClass: 'animate-fadeout' }"
      class="info-card"
    >
      <i class="pi pi-thumbs-up info-card__icon" />
      <span class="info-card__text"> Only official games </span>
    </div>
    <div class="h-[30rem]"></div>
    <div
      v-animateonscroll="{ enterClass: 'animate-fadeinleft', leaveClass: 'animate-fadeoutleft' }"
      class="info-card"
    >
      <i class="pi pi-lock-open info-card__icon" />
      <span class="info-card__text"> Without DRM </span>
    </div>
    <div class="h-[30rem]"></div>
    <div
      v-animateonscroll="{ enterClass: 'animate-fadeinright', leaveClass: 'animate-fadeoutright' }"
      class="info-card"
    >
      <i class="pi pi-users info-card__icon" />
      <span class="info-card__text"> Big community </span>
    </div>
    <div class="h-[30rem]"></div>
    <div
      v-animateonscroll="{ enterClass: 'animate-zoomin', leaveClass: 'animate-fadeout' }"
      class="info-card"
    >
      <i class="pi pi-code info-card__icon" />
      <span class="info-card__text"> Support for developers </span>
    </div>
    <div class="h-[30rem]"></div>
    <div
      v-animateonscroll="{ enterClass: 'animate-flipleft', leaveClass: 'animate-fadeout' }"
      class="info-card"
    >
      <i class="pi pi-money-bill info-card__icon" />
      <span class="info-card__text"> Cheap prices </span>
    </div>
    <div class="h-[30rem]"></div>
    <div
      v-animateonscroll="{ enterClass: 'animate-flipup', leaveClass: 'animate-fadeout' }"
      class="info-card"
    >
      <i class="pi pi-sparkles info-card__icon" />
      <span class="info-card__text"> Newest AAA-titles </span>
    </div>
    <div class="h-[30rem]"></div>
    <div
      v-animateonscroll="{ enterClass: 'animate-scalein', leaveClass: 'animate-fadeout' }"
      class="info-card"
    >
      <i class="pi pi-gift info-card__icon" />
      <span class="info-card__text"> Bonuses and sales </span>
    </div>
    <div class="h-[30rem]"></div>
  </div>
</template>

<style>
@keyframes slidedown-icon {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(20px);
  }

  100% {
    transform: translateY(0);
  }
}

.slidedown-icon {
  animation: slidedown-icon;
  animation-duration: 3s;
  animation-iteration-count: infinite;
}

.banner {
  max-height: 700px;
}

.info-card {
  @apply flex flex-col bg-primary text-primary-contrast shadow-lg justify-center items-center h-40 w-40 sm:h-60 sm:w-60 rounded-2xl animate-duration-1000 animate-ease-in-out;
}

.info-card__icon {
  font-size: 3rem;
}

.info-card__text {
  @apply text-3xl font-bold text-center;
}
</style>
