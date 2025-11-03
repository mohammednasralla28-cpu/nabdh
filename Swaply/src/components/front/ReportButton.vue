<script setup>
import { mdiFlagOutline } from "@mdi/js";
import MdiIcon from "./MdiIcon.vue";
const props = defineProps({
  text: {
    type: String,
    default: "ابلاغ عن غلاء الاسعار",
  },
});
</script>

<template>
  <div class="relative">
    <button
      class="flex items-center gap-1 w-[30px] hover:w-[150px] overflow-hidden border border-gray-500 rounded-md px-2 py-1 transition-all dark:hover:bg-gray-700 hover:bg-gray-50 duration-300 bg-white dark:bg-gray-800">
      <MdiIcon class="text-gray-600 dark:text-red-400 flex-shrink-0" :icon="mdiFlagOutline" style="width: 16px" />

      <span class="ml-2 whitespace-nowrap text-[12px] font-normal text-gray-600 dark:text-white">
        {{ text }}
      </span>
    </button>
  </div>
</template>