<script setup>
import { ref } from "vue";

const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  activeId: { type: String, required: true },
});

const emit = defineEmits(["update:activeId", "scrollTo"]);

const isActive = ref(false);

const handleClick = () => {
  emit("update:activeId", props.id);
  emit("scrollTo", { id: props.id, label: props.label });
};
</script>

<template>
  <li>
    <a :href="'#' + id" @click.prevent="handleClick" :class="[
      'flex items-center gap-3 p-[10px] rounded-lg transition-colors font-medium text-[16px]',
      activeId === id
        ? 'text-white bg-blue-700 dark:bg-gray-600'
        : 'text-blue-950 hover:bg-blue-100 dark:text-gray-200 dark:hover:bg-gray-700',
    ]">
      <span class="icon">
        <slot name="icon" />
      </span>
      <span>{{ label }}</span>
    </a>
  </li>
</template>
