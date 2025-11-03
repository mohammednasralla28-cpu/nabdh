<script setup lang="ts">
import { ArrowRightIcon } from "@heroicons/vue/24/solid";
</script>

<template>
  <div class="flex items-center py-4">
    <div class="absolute right-16 back-button flex items-center justify-start cursor-pointer gap-2 mb-4"
      @click="$router.push({ name: 'home' })">
      <ArrowRightIcon class="w-4 h-4 cursor-pointer hidden lg:block text-black dark:text-white" />
      <span class="text-black dark:text-white">الرجوع</span>
    </div>
    <div class="logo flex-1 flex justify-center items-center">
      <img src="/Logo.png" class="w-28 block dark:hidden" alt="logo" />
      <img src="/Logo-black.png" class="w-28 hidden dark:block" alt="logo" />
    </div>
  </div>
</template>