<script setup>
import { onMounted, ref, watch, inject } from "vue";
import SecondaryTitle from "./global/SecondaryTitle.vue";
import SingleSettingAccountBox from "./SingleSettingAccountBox.vue";
import BaseSwitch from "./global/BaseSwitch.vue";
import SingleFavoriteStructure from "./SingleFavoriteStructure.vue";
import ConfirmDeleteDialog from "../dashboard/global/ConfirmDeleteDialog.vue";
import { useAuthStore } from "../../stores/auth/auth";
import { storeToRefs } from "pinia";
import { useCityStore } from "../../stores/city";
import SelectListBox from "./global/SelectListBox.vue";
const deleteDialog = ref({
  dialog: false,
});
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const password = ref("password");
const currentPassword = ref("");
const currentPasswordDialog = ref(false);
const isDeleteAccount = ref(false);
const emitter = inject("emitter");
const cityStore = useCityStore();
const { cities } = storeToRefs(cityStore);

const openConfirmPasswordDialog = () => {
  currentPasswordDialog.value = true;
  currentPassword.value = "";
  isDeleteAccount.value = deleteDialog.value.dialog;
};

const update = async () => {
  if (isDeleteAccount.value) {
    if (!currentPassword.value) {
      emitter?.emit("showNotificationAlert", [
        "error",
        "يرجى إدخال كلمة المرور الحالية",
      ]);
      return;
    }
    await deleteAccount(currentPassword.value);
    return;
  }
  if (password.value === "") {
    emitter?.emit("showNotificationAlert", [
      "error",
      "يرجى إدخال كلمة مرور جديدة",
    ]);
    return;
  }

  if (password.value.length < 6) {
    emitter?.emit("showNotificationAlert", [
      "error",
      "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
    ]);
    return;
  }

  if (currentPassword.value === "") {
    emitter?.emit("showNotificationAlert", [
      "error",
      "يرجى إدخال كلمة المرور الحالية",
    ]);
    return;
  }
  try {
    await authStore.update({
      password: password.value,
      current_password: currentPassword.value,
    });
    password.value = "password";
    currentPassword.value = "";
    currentPasswordDialog.value = false;
  } catch (error) {
  }
};
watch(
  () => user.value?.city,
  async (newVal) => {
    if (newVal?.id) {
      await authStore.update({
        city_id: newVal.id,
      });
    }
  }
);
watch(
  () => user.value?.share_location,
  async (newVal) => {
    if (user.value) {
      await authStore.update(
        {
          share_location: +newVal,
        },
        false
      );
    }
  }
);

const deleteAccount = async (password) => {
  try {
    await authStore.deleteAccount(password);
    deleteDialog.value.dialog = false;
  } catch (error) {
  }
};
onMounted(async () => {
  await cityStore.fetchAllCities();
});
</script>

<template>
  <SecondaryTitle label="الخصوصية و الامان" class="mb-3" />
  <div class="border rounded-xl p-6 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
    <SingleSettingAccountBox label="كلمة المرور" v-model:value="password" input-type="password" id="password"
      @update="openConfirmPasswordDialog" />
    <SingleFavoriteStructure title="مشاركة الموقع" description="السماح بمشاركة موقعك">
      <template #action>
        <BaseSwitch :model-value="!!user?.share_location"
          @update:modelValue="(val) => { if (user) user.share_location = val ? 1 : 0 }" />
      </template>
      <SelectListBox v-if="!!user?.share_location && user" class="w-full" v-model="user.city" :options="cities"
        label="اختر المدينة التي تقيم فيها" />
    </SingleFavoriteStructure>
    <div class="mt-4">
      <p
        class="text-red-700 bg-red-100 dark:text-red-200 dark:bg-red-800/70 font-medium text-[16px] mb-3 flex w-fit px-3 py-1 rounded-full"
        
      >
        منطقة خطر
      </p>
      <button @click="deleteDialog.dialog = true"
        class="font-medium text-white bg-red-600 hover:bg-red-600/90 transition-opacity rounded-lg w-full block py-3">
        حذف الحساب
      </button>
      <p class="text-[12px] text-gray-500 dark:text-gray-300 mt-2 text-center font-normal">
        حذف الحساب سوف يؤدي الي فقدان جميع البيانات بشكل نهائي
      </p>
    </div>
  </div>
  <ConfirmDeleteDialog v-model="deleteDialog.dialog" title="حذف الحساب"
    message="هل أنت متأكد من رغبتك بحذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه." button-label="حذف الحساب"
    @confirm="openConfirmPasswordDialog" />
  <ConfirmDeleteDialog v-model="currentPasswordDialog" title="تأكيد كلمة المرور"
    message="يرجى إدخال كلمة المرور الحالية لتأكيد التغيير." button-label="تأكيد" @confirm="update">
    <input type="password" v-model="currentPassword"
      class="rounded-md w-full p-[6px] block placeholder:text-[14px] font-medium bg-gray-100 text-blue-950 focus:border-gray-500 focus:ring-gray-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-gray-400 dark:focus:ring-gray-400 text-right"
      dir="ltr" placeholder="كلمة المرور" />
  </ConfirmDeleteDialog>
</template>
