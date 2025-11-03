<script setup>
import { PlusIcon } from "@heroicons/vue/24/solid";
</script>

<template>
  <div class="flex gap-4 items-center justify-between">
    <button @click="$emit('addProduct')"
      class="text-[14px] flex gap-1 font-normal border-2 bg-blue-700 border-blue-700 text-white rounded-lg px-4 py-[6px] transition-colors hover:bg-blue-800 hover:border-blue-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
      <PlusIcon class="w-5 h-5" />
      <span> اضافة منتج </span>
    </button>
  </div>
</template>