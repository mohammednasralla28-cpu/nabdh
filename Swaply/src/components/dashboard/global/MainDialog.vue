<template>
  <div>
    <div class="fixed inset-0 flex items-center justify-center" :class="{
      'z-50': showDialog,
      '-z-50': !showDialog,
    }">
      <!-- الخلفية -->
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeDialog" v-if="showDialog" />

      <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-300"
        leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
        <div v-if="showDialog"
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-96 p-6 relative z-10 dark:shadow-white/5"
          @click.stop>
          <!-- title -->
          <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            <slot name="title" />
          </h2>

          <slot name="content" />

          <!-- buttons -->
          <div class="flex justify-end gap-3 mt-6">
            <button @click="closeDialog"
              class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white">
              إلغاء
            </button>
            <button @click="emit('submitData')"
              class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              :class="{ 'pointer-events-none': loading }">
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
  buttonLabel: { type: String, default: "اضافة" },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue", "submitData"]);

const showDialog = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const closeDialog = () => (showDialog.value = false);
</script>
