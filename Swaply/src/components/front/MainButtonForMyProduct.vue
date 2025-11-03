<script setup>
import MdiIcon from "./MdiIcon.vue";

defineProps({
  label: {
    type: String,
  },
  icon: [Object, Function, String],
});
</script>
<template>
  <button class="flex items-center justify-center w-full py-2 border-2 rounded-lg min-w-[130px]">
    <MdiIcon class="text-white" :icon="icon" />
    <span class="font-normal text-[14px]">{{ label }}</span>
  </button>
</template>