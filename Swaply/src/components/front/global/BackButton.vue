<script setup>
import { ChevronRightIcon } from "@heroicons/vue/24/outline";

const props = defineProps({
  label: {
    type: String,
    default: "الرجوع",
  },
});
</script>

<template>
  <div class="back-button flex items-center justify-start cursor-pointer gap-1 mb-4"
    @click="$router.push({ name: 'home' })">
    <ChevronRightIcon class="w-[18px] h-[18px] mt-[2px] cursor-pointer hidden lg:block text-black dark:text-white" />
    <span class="text-black dark:text-white">{{ label }}</span>
  </div>
</template>