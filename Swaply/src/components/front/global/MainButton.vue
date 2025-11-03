<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "button",
  },
});
</script>

<template>
  <button :type="type"
    class="bg-blue-700 text-white flex w-full items-center justify-center p-2 rounded-lg transition-all hover:bg-blue-600 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700">
    <slot name="icon" />
    <span class="font-medium">{{ label }}</span>
  </button>
</template>