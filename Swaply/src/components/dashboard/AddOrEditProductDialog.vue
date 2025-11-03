<script setup>
import { computed, inject, onMounted, ref } from "vue";
import MainDialog from "./global/MainDialog.vue";
import ComboboxComponent from "./global/ComboboxComponent.vue";
import axiosClient from "../../axiosClient";
import { useCategoryStore } from "../../stores/category";
import { storeToRefs } from "pinia";
import { watch } from "vue";

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  mode: { type: String, default: "create" },
  product: { type: Object, default: () => ({}) },
});

const emit = defineEmits([
  "update:modelValue",
  "update:product",
  "fetchProducts",
]);

const loading = ref(false);
const emitter = inject("emitter");

const showDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const localProductName = computed({
  get: () => props.product?.name || "",
  set: (val) => emit("update:productName", val),
});

const categoryStore = useCategoryStore();
const { categories } = storeToRefs(categoryStore);
const localCategory = computed({
  get: () =>
    props.product?.category
      ? props.categories.find((c) => c.id === props.product.categoryId)
      : null,
});

const category = ref(localCategory.value);

const currentMode = computed(() => props.mode);

const closeDialog = () => emit("update:modelValue", false);

const label = computed(() => {
  let base = currentMode.value === "create" ? "إضافة" : "تعديل";
  return loading.value ? base + "..." : base;
});

watch(
  () => props.modelValue,
  (newVal) => {
    const id = props.product?.category_id;
    if (newVal && id) {
      category.value = categories.value.filter((el) => el.id == id)[0];
    }
  }
);
const saveProduct = async () => {
  try {
    loading.value = true;
    if (currentMode.value === "create") {
      const response = await axiosClient.post("/admin/products", {
        name: props.product.name,
        price: props.product.price,
        category_id: category.value.id,
      });
      if (response.status == 201) {
        emitter.emit("showNotificationAlert", [
          "success",
          `تم اضافة المنتج ${localProductName.value} بنجاح!`,
        ]);
        emit("fetchProducts");
      }
    } else {
      const response = await axiosClient.put(
        `/admin/products/${props.product.id}`,
        {
          name: props.product.name,
          price: props.product.price,
          category_id: category.value.id,
        }
      );
      if (response.status == 200) {
        emitter.emit("showNotificationAlert", [
          "success",
          `تم تحديث المنتج ${localProductName.value} بنجاح!`,
        ]);
        emit("fetchProducts");
      }
    }
    closeDialog();
  } catch (e) {
  } finally {
    loading.value = false;
  }
};

const submit = () => saveProduct();

onMounted(async () => {
  await categoryStore.fetchAllCategoriesIds();
});
</script>

<template>
  <MainDialog v-model="showDialog" :button-label="label" @submit-data="submit" :loading="loading">
    <template #title>
      {{ currentMode === "create" ? "إضافة منتج جديد" : "تعديل المنتج" }}
    </template>

    <template #content>
      <input v-model="product.name" type="text" placeholder="اسم المنتج"
        class="w-full border rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-blue-400 outline-none" />
      <div class="relative w-full">
        <input v-model="product.price" type="number" placeholder="سعر المنتج"
          class="w-full border rounded-lg pr-7 py-2 mb-3 focus:ring-2 focus:ring-blue-400 outline-none appearance-none" />
        <span class="absolute right-1 text-[25px] -mt-2 top-1/2 -translate-y-1/2 text-gray-700 dark:text-gray-200 px-2">
          ₪
        </span>
      </div>

      <ComboboxComponent placeholder="اختر اسم التصنيف" v-model="category" :items="categories" />
    </template>
  </MainDialog>
</template>
