<style>
::-webkit-calendar-picker-indicator {
  filter: invert(1);
}
</style>

<template>

  <div class="mb-3 relative">
    <MainLabel :id="id" :label="label" />

    <div v-if="type === 'textarea'">
      <textarea v-model="modelValue" v-bind="$attrs" :placeholder="placeholder" :required="isRequired"
        class="border-gray-300 border-1 dark:border-gray-600 focus:border-gray-500 focus:ring-gray-500 rounded-md resize-none bg-gray-100 dark:bg-gray-700 dark:text-white block w-full placeholder:text-[14px] placeholder:font-normal dark:placeholder-gray-400 h-20"></textarea>
      <ErrorInputText :error-message="errorMessage" />
    </div>

    <div v-else class="relative">
      <input v-model="modelValue" v-bind="$attrs" :type="type" :placeholder="placeholder" :required="isRequired"
        class="block w-full no-spinner rounded-md placeholder:text-[14px] placeholder:font-normal pr-3 border-gray-300 border-1 dark:border-gray-600" :class="{
          'border-red-600 focus:border-red-500 dark:text-white focus:ring-red-600 bg-red-100/70 dark:bg-gray-700 placeholder:text-red-600':
            errorMessage,
          'focus:border-gray-500 dark:text-white focus:ring-gray-500  bg-gray-100 dark:bg-gray-700 dark:placeholder-gray-400':
            !errorMessage,
        }" />

      <!-- مكان العلامة -->
      <span v-if="$slots.suffix" class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-xl">
        <slot name="suffix" />
      </span>
    </div>

    <ErrorInputText :error-message="errorMessage" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import ErrorInputText from "./ErrorInputText.vue";
import MainLabel from "./MainLabel.vue";

defineOptions({
  inheritAttrs: false,
});

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "text",
  },
  placeholder: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    required: true,
  },
  errorMessage: {
    type: String,
    default: "",
  },
  isRequired: {
    type: Boolean,
    default: true,
  },
  modelValue: {
    type: [String, Number],
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);
const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>
