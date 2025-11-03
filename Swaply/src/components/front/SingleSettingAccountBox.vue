<script setup>
import { CheckIcon, XMarkIcon } from "@heroicons/vue/24/solid";
import { computed, ref, watch } from "vue";

const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  value: { type: String, required: true },
  buttonLabel: { type: String, default: "تعديل" },
  inputType: { type: String, default: "text" },
  error: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["update", "update:value"]);

const localValue = ref("");

watch(
  () => props.value,
  (newVal) => {
    localValue.value =
      newVal === "غير معروف" ? "" : newVal === "password" ? "" : newVal;
  },
  { immediate: true }
);

const isEdit = ref(false);

const displayValue = computed(() =>
  props.inputType === "password" ? "*".repeat(props.value.length) : props.value
);

const saveEdit = () => {
  emit("update", { id: props.id, value: localValue.value });
  emit("update:value", localValue.value);
  isEdit.value = false;
};

const cancelEdit = () => {
  localValue.value = props.value;
  isEdit.value = false;
};
</script>

<template>
  <div class="last-of-type:border-none border-b last-of-type:p-0 pb-3 mt-4 first-of-type:mt-0 dark:border-gray-700">
    <span class="text-gray-600 dark:text-gray-300 font-medium text-[14px] mb-3 block">
      {{ label }}
    </span>

    <div v-if="isEdit" class="flex items-center gap-4 mt-3">
      <input :type="inputType" v-model="localValue"
        class="rounded-md w-full p-[6px] block placeholder:text-[14px] font-medium bg-gray-100 text-blue-950 focus:border-gray-500 focus:ring-gray-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-gray-400 dark:focus:ring-gray-400 text-right"
        dir="ltr" />
      <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
      <div class="action flex justify-end gap-1">
        <span @click="saveEdit"
          class="cursor-pointer w-9 h-7 rounded-md flex items-center justify-center active:bg-gray-200 dark:active:bg-gray-600">
          <CheckIcon class="w-5 h-5 dark:text-white" />
        </span>
        <span @click="cancelEdit"
          class="cursor-pointer w-9 h-7 rounded-md flex items-center justify-center active:bg-gray-200 dark:active:bg-gray-600">
          <XMarkIcon class="w-5 h-5 dark:text-white" />
        </span>
      </div>
    </div>

    <div v-else class="font-medium flex items-center justify-between text-blue-950 dark:text-white">
      <p dir="ltr">{{ displayValue }}</p>
      <button @click="isEdit = true"
        class="w-fit border rounded-lg py-2 px-4 text-[12px] font-medium transition border-gray-200 hover:bg-gray-100 focus:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700"
        dir="ltr">
        {{ buttonLabel }}
      </button>
    </div>
  </div>
</template>
