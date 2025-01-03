<script setup>
import MainPageImage from '../assets/main-page-banner.jpg'
</script>

<template>
  <img :src="MainPageImage" alt="Par" class="banner" />

  <main class="mt-5">
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

<style scoped></style>
