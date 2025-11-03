<script setup>
import { computed, inject, ref } from "vue";
import MainDialog from "./global/MainDialog.vue";
import axiosClient from "../../axiosClient";
import SelectListBox from "../front/global/SelectListBox.vue";

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  user: { type: Object, default: () => ({}) },
  userRole: { type: String, default: "" },
  userStatus: { type: String, default: "" },
});

const emit = defineEmits([
  "update:modelValue",
  "update:userRole",
  "update:userStatus",
  "fetchUsers",
]);

const rolesOptions = [
  { id: 1, name: "تاجر", val: "merchant" },
  { id: 2, name: "مستهلك", val: "customer" },
];
const StatusOptions = [
  { id: 1, name: "معلق", val: "pending" },
  { id: 2, name: "نشط", val: "active" },
  { id: 2, name: "غير نشط", val: "inactive" },
];

const loading = ref(false);
const emitter = inject("emitter");

const showDialog = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const closeDialog = () => emit("update:modelValue", false);

const label = computed(() => {
  return loading.value ? "تعديل" + "..." : "تعديل";
});

const userRole = computed({
  get: () => rolesOptions.find((r) => r.val === props.userRole) || null,
  set: (option) => emit("update:userRole", option?.val || ""),
});

const userStatus = computed({
  get: () => StatusOptions.find((r) => r.val === props.userStatus) || nulls,
  set: (option) => emit("update:userStatus", option?.val || ""),
});

const updateUser = async () => {
  try {
    loading.value = true;
    const response = await axiosClient.put(`/admin/users/${props.user.id}`, {
      role: userRole.value.val,
      status: userStatus.value.val,
    });
    if (response.status == 200) {
      emitter.emit("showNotificationAlert", [
        "success",
        `تم تحديث بيانات المستخدم ${props.user?.name} بنجاح!`,
      ]);
      emit("fetchUsers");
    }
    closeDialog();
  } catch (e) {
  } finally {
    loading.value = false;
  }
};

const submit = () => updateUser();
</script>

<template>
  <MainDialog v-model="showDialog" :button-label="label" @submit-data="submit" :loading="loading">
    <template #title> تعديل بيانات المستخدم </template>

    <template #content>
      <SelectListBox label="اختر دور المستخدم" v-model="userRole" :options="rolesOptions" class="w-full" />
      <SelectListBox label="اختر حالة المستخدم" v-model="userStatus" :options="StatusOptions" class="w-full mt-4" />
    </template>
  </MainDialog>
</template>
