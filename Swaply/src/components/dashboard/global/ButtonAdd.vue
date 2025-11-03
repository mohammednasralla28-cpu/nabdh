<script setup>
import { PlusIcon } from "@heroicons/vue/24/solid";
defineProps({
  label: {
    type: String,
    default: "اضافة جديد",
  },
});
</script>

<template>
  <button
    class="flex items-center gap-2 text-[15px] bg-blue-600 text-white font-normal transition-all duration-300 py-3 px-4 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
    <PlusIcon class="w-5" />
    <span>{{ label }}</span>
  </button>
</template>
