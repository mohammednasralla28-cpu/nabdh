<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/40 border border-yellow-300 dark:border-yellow-700">
    <h5 class="title text-yellow-800 dark:text-yellow-200 font-medium mb-1">{{ title }}</h5>
    <p class="text text-yellow-800 dark:text-yellow-200 text-[14px] font-extralight">{{ text }}</p>
  </div>
</template>
