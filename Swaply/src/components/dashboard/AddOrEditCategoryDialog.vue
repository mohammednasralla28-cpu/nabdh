<script setup>
import { computed, inject, ref, watch } from "vue";
import MainDialog from "./global/MainDialog.vue";
import axiosClient from "../../axiosClient";
import ErrorInputText from "../front/global/ErrorInputText.vue";
import useFormats from "../../mixins/formats";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  mode: {
    type: String,
    default: "create",
  },
  category: {
    type: [Object, String],
    default: {},
  },
});

const emit = defineEmits([
  "update:modelValue",
  "update:category",
  "fetchCategories",
]);
const emitter = inject("emitter");
const loading = ref(false);
const errors = ref({});
const { cleanId } = useFormats();

const showDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const localCategoryName = computed({
  get: () => {
    if (!props.category) return "";
    return typeof props.category === "string"
      ? props.category
      : props.category.name ?? "";
  },
  set: (val) => {
    if (typeof props.category === "string" || !props.category) {
      emit("update:category", val);
    } else {
      emit("update:category", { ...props.category, name: val });
    }
  },
});

const currentMode = computed(() => {
  return props.mode;
});


// إغلاق المودال
const closeDialog = () => {
  errors.value = {};
  emit("update:modelValue", false);
};
const label = computed(() => {
  let base = currentMode.value === "create" ? "إضافة" : "تعديل";
  return loading.value ? base + "..." : base;
});


const submit = async () => {
  try {
    loading.value = true;

    if (currentMode.value === "create") {
      const response = await axiosClient.post("/admin/categories", {
        name: localCategoryName.value,
      });
      if (response.status == 200) {
        closeDialog();
        emitter.emit("showNotificationAlert", [
          "success",
          `تم اضافة التصنيف ${localCategoryName.value} بنجاح!`,
        ]);
        emit("fetchCategories");
      }
    } else if (props.category.id) {
      const response = await axiosClient.put(
        `/admin/categories/${cleanId(props.category.id)}`,
        {
          name: localCategoryName.value,
        }
      );
      if (response.status == 200) {
        closeDialog();
        emitter.emit("showNotificationAlert", [
          "success",
          `تم تحديث التصنيف ${localCategoryName.value} بنجاح!`,
        ]);
        emit("fetchCategories");
      }
    }
  } catch (e) {
    errors.value = e.response?.data?.errors || {};
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <MainDialog v-model="showDialog" :button-label="label" :loading="loading" @submitData="submit">
    <template #title>
      {{ mode === "create" ? "إضافة تصنيف جديد" : "تعديل التصنيف" }}
    </template>
    <template #content>
      <input v-model="localCategoryName" type="text" placeholder="اسم التصنيف"
        class="w-full rounded-lg px-3 py-2 outline-none transition-all duration-200" :class="{
          'border border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-400':
            !errors.name?.[0],
          'border border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500':
            errors.name?.[0],
        }" />
      <ErrorInputText :error-message="errors.name?.[0]" />
    </template>
  </MainDialog>
</template>