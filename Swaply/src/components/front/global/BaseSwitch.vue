<script setup>
import { computed } from "vue";
import { Switch } from "@headlessui/vue";

const props = defineProps({
  modelValue: Boolean,
  activeColor: { type: String, default: "bg-black" },
  inactiveColor: { type: String, default: "bg-gray-200" },
});

const emit = defineEmits(["update:modelValue"]);

// استخدام computed بدل watch
const localValue = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});
</script>

<template>
  <Switch v-model="localValue" :class="[
    localValue
      ? 'bg-blue-800 dark:bg-blue-700'
      : 'bg-gray-200 dark:bg-gray-700',
    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors rotate-[180deg]',
  ]">
    <span class="sr-only"></span>
    <span :class="[
      localValue ? '-translate-x-6' : '-translate-x-1',
      'inline-block h-4 w-4 transform rounded-full bg-white dark:bg-gray-300 transition-transform',
    ]" />
  </Switch>
</template>
