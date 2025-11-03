<script setup>
import { computed, inject, ref } from "vue";
import MainDialog from "./global/MainDialog.vue";
import SelectListBox from "../front/global/SelectListBox.vue";
import axiosClient from "../../axiosClient";
import useFormats from "../../mixins/formats";

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  store: { type: Object, default: () => ({}) },
  storeStatus: { type: String, default: "" },
});

const emit = defineEmits([
  "update:modelValue",
  "update:storeStatus",
  "fetchStores",
]);

const StatusOptions = [
  { id: 1, name: "معلق", val: "pending" },
  { id: 2, name: "نشط", val: "active" },
  { id: 3, name: "غير نشط", val: "inactive" },
];

const loading = ref(false);
const emitter = inject("emitter");
const { cleanId } = useFormats();

const showDialog = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const closeDialog = () => emit("update:modelValue", false);

const label = computed(() => {
  return loading.value ? "تعديل..." : "تعديل";
});

const storeStatus = computed({
  get: () => StatusOptions.find((s) => s.val === props.storeStatus) || null,
  set: (option) => emit("update:storeStatus", option?.val || ""),
});

const updateStore = async () => {
  try {
    loading.value = true;
    const response = await axiosClient.put(
      `/admin/stores/${cleanId(props.store.id)}`,
      {
        status: storeStatus.value.val,
      }
    );
    if (response.status == 200) {
      emitter.emit("showNotificationAlert", [
        "success",
        `تم تحديث حالة المتجر ${props.store?.name} بنجاح!`,
      ]);
      emit("fetchStores");
    }
    closeDialog();
  } catch (e) {
  } finally {
    loading.value = false;
  }
};

const submit = () => updateStore();
</script>

<template>
  <MainDialog v-model="showDialog" :button-label="label" @submit-data="submit" :loading="loading">
    <template #title> تعديل بيانات المتجر </template>

    <template #content>
      <SelectListBox label="اختر حالة المتجر" v-model="storeStatus" :options="StatusOptions" class="w-full" />
    </template>
  </MainDialog>
</template>
