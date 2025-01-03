<script setup>
import MainPageImage from '../assets/main-page-banner.jpg'
</script>

<template>
  <img :src="MainPageImage" alt="Par" class="banner" />

  <main>
    <div class="card flex flex-col items-center">
      <div class="flex flex-col items-center gap-2">
        <span class="text-xl font-medium">Welcome to Par Store!</span>
        <span
          class="slidedown-icon h-8 w-8 bg-primary text-primary-contrast rounded-full inline-flex items-center justify-center"
        >
          <i class="pi pi-arrow-down" />
        </span>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  margin-top: 5rem;
}

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
</style>
