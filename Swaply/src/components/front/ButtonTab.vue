<script setup>
const props = defineProps({
  label: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  icon: {
    type: [Object, Function],
  },
  type: {
    type: String,
    default: "button",
  },
});
</script>
<template>
  <button :type="type" class="border-2 flex-1 transition-all font-normal flex items-center justify-center gap-1" :class="{
    'bg-white border-gray-300 text-gray-900 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700 dark:border-blue-700 focus:hover:bg-white dark:focus:hover-bg-blue-600':
      isActive,
    'border-transparent text-gray-600 dark:text-gray-50 hover:bg-white dark:hover:bg-white/45':
      !isActive,
  }">
    <component :is="icon" class="w-6 h-6" />
    <span>
      {{ label }}
    </span>
  </button>
</template>
