<script setup>
import { useRouter } from "vue-router";

defineProps({
  title: {
    type: String,
    default: "الملف الشخصي",
  },
  name: {
    type: String,
    default: "personal_profile",
  },
});

const router = useRouter();
</script>
<template>
  <div class="cursor-pointer flex flex-col justify-center items-center text-center transition-all
 p-2 min-w-16 h-full lg:w-36 max-lg:w-32 minimum font-light text-[14px] text-nowrap ml-0" style="margin-left: 0"
    @click="router.push({ name: name })" :class="{
      'bg-blue-100 dark:bg-gray-500': router.currentRoute.value.name === name,
      'hover:bg-gray-50 dark:hover:bg-gray-700':
        router.currentRoute.value.name !== name,
      'text-black dark:text-gray-300': router.currentRoute.value.name !== name,
      'dark:text-white': router.currentRoute.value.name === name,
    }">
    <span class="relative">
      <slot name="icon" />
    </span>
    <span class="text-[12px]">{{ title }}</span>
  </div>
</template>
