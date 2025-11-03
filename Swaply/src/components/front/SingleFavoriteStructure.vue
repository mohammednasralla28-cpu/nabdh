<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});
</script>


<template>
  <div class="last-of-type:border-none border-b dark:border-gray-700 last-of-type:p-0 pb-3 mt-4 first-of-type:mt-0">
    <div class="flex items-center justify-between">
      <div>
        <span class="text-blue-950 dark:text-white font-medium text-[16px] mb-1 block">
          {{ title }}
        </span>
        <span class="text-gray-600 dark:text-gray-300 font-normal text-[14px] mb-2 block">
          {{ description }}
        </span>
      </div>
      <div>
        <slot name="action" />
      </div>
    </div>
    <slot />
  </div>
</template>