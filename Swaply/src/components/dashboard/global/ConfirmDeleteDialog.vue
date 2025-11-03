<template>
  <div>
    <div class="fixed inset-0 flex items-center justify-center" :class="{
      'z-[10000000]': showDialog,
      '-z-50': !showDialog,
    }">
      <!-- الخلفية -->
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeDialog" v-if="showDialog" />

      <!-- الصندوق -->
      <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-300"
        leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
        <div v-if="showDialog" class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-96 p-6 relative z-10"
          @click.stop>
          <!-- عنوان المودال -->
          <h2 class="text-[15px] font-semibold mb-2 text-gray-800 dark:text-gray-100">
            {{ title }}
          </h2>

          <!-- رسالة التأكيد -->
          <p class="text-gray-600 dark:text-gray-300 mb-4">
            {{ message }}
          </p>
          <slot />
          <!-- الأزرار -->
          <div class="flex justify-end gap-3 mt-6">
            <button @click="closeDialog"
              class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white">
              إلغاء
            </button>
            <button @click="confirmAction"
              class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600">
              {{ buttonLabel }}
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: "تأكيد الحذف" },
  message: { type: String, default: "هل أنت متأكد من رغبتك بحذف هذا العنصر؟" },
  buttonLabel: { type: String, default: "حذف" },
});

const emit = defineEmits(["update:modelValue", "confirm"]);

const showDialog = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const closeDialog = () => (showDialog.value = false);

const confirmAction = () => {
  emit("confirm");
  closeDialog();
};
</script>
