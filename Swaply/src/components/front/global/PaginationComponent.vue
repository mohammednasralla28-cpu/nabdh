<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  lastPage: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const changePage = (page) => {
  if (page >= 1 && page <= props.lastPage) {
    emit("update:modelValue", page);
  }
};

const pages = computed(() => {
  const total = props.lastPage;
  const current = props.modelValue;
  const pages = [];

  if (total <= 9) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1, 2);

    if (current > 4) pages.push("...");

    for (let i = current - 1; i <= current + 1; i++) {
      if (i > 2 && i < total - 1) pages.push(i);
    }

    if (current < total - 3) pages.push("...");

    pages.push(total - 1, total);
  }

  return pages;
});
</script>

<template>
  <div class="flex items-center justify-center gap-2 mt-6 select-none">
    <button class="px-3 py-1 border rounded-2xl disabled:opacity-50 text-gray-800 dark:text-white"
      :disabled="modelValue === 1" @click="changePage(modelValue - 1)">
      السابق
    </button>

    <button v-for="(page, index) in pages" :key="index" @click="typeof page === 'number' && changePage(page)"
      class="px-3 py-1 border rounded-2xl" :class="[
        typeof page === 'number'
          ? page === modelValue
            ? 'bg-blue-600 text-white'
            : 'bg-white'
          : 'bg-gray-100 cursor-default',
      ]" :disabled="page === '...'">
      {{ page }}
    </button>

    <button class="px-3 py-1 border rounded-2xl disabled:opacity-50 text-gray-800 dark:text-white"
      :disabled="modelValue === lastPage" @click="changePage(modelValue + 1)">
      التالي
    </button>
  </div>
</template>
