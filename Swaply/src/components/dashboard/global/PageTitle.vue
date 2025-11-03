<script setup>
defineProps({
  title: String,
});
</script>
<template>
  <h2 class="text-[28px] font-medium text-slate-600 dark:text-slate-300">
    {{ title }}
  </h2>
</template>