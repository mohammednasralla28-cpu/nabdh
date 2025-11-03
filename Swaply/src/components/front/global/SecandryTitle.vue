<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <h3 class="title font-[500] text-[18px] text-blue-950 dark:text-white pr-2">
    {{ label }}
  </h3>
</template>