<!-- components/Notification.vue -->
<template>
  <div :class="[
    'flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white font-medium text-nowrap',
    typeClasses,
  ]">
    <!-- Icon -->
    <span class="w-5 h-5 flex-shrink-0">
      <component :is="iconComponent" class="w-[22px]" />
    </span>

    <!-- Message -->
    <span>{{ message }}</span>
  </div>
</template>

<script setup>
import { computed } from "vue";

// Heroicons
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon } from "@heroicons/vue/24/solid";

const props = defineProps({
  message: String,
  type: { type: String, default: "info" }, // success / error / info
  duration: { type: Number, default: 3000 },
});

const typeClasses = computed(() => {
  switch (props.type) {
    case "success":
      return "bg-green-500 dark:bg-green-600";
    case "error":
      return "bg-red-500 dark:bg-red-600";
    case "info":
    default:
      return "bg-blue-500 dark:bg-blue-600";
  }
});

const iconComponent = computed(() => {
  switch (props.type) {
    case "success":
      return CheckCircleIcon;
    case "error":
      return XCircleIcon;
    case "info":
    default:
      return InformationCircleIcon;
  }
});
</script>
