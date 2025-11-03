<script setup>
defineProps({
  title: {
    type: String,
  },
  subtitle: {
    type: String,
  },
});
</script>

<template>
  <h3 class="title font-medium text-[24px] text-black dark:text-white mt-16">
    {{ title }}
  </h3>
  <p class="subtitle font-normal text-gray-600 mt-1 dark:text-gray-300">
    {{ subtitle }}
  </p>
</template>
