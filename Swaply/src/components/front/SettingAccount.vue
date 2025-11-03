<script setup>
import { inject, onMounted, reactive, ref } from "vue";
import SecondaryTitle from "./global/SecondaryTitle.vue";
import SelectListBox from "./global/SelectListBox.vue";
import SingleSettingAccountBox from "./SingleSettingAccountBox.vue";
import { ShoppingBagIcon, UserIcon } from "@heroicons/vue/24/outline";
import { useAuthStore } from "../../stores/auth/auth";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import axiosClient from "../../axiosClient";
import { watch } from "vue";
import { useCityStore } from "../../stores/city";
import * as yup from "yup";

const userStore = useAuthStore();
const { user } = storeToRefs(userStore);
const cityStore = useCityStore();
const { cities } = storeToRefs(cityStore);
const items = ref([
  {
    id: "name",
    label: "الاسم",
    value: user.value?.name ?? "",
  },
  {
    id: "email",
    label: "الايميل",
    value: user.value?.email ?? "غير معروف",
  },
  {
    id: "phone",
    label: "رقم الهاتف",
    value: user.value?.phone ?? "غير معروف",
  },
]);

const accountOptionsType = [
  { id: "1", name: "مستهلك", label: "حساب مستهلك" },
  { id: "2", name: "تاجر", label: "حساب تجاري" },
];

const merchantSettings = reactive([
  {
    id: "name",
    label: "اسم المحل",
    value: user.value?.store?.name ?? "غير معروف",
  },
  {
    id: "address",
    label: "عنوان المحل",
    value: user.value?.store?.address ?? "غير معروف",
  },
]);

const selectedAccountType = computed({
  get() {
    return user.value?.role === "merchant"
      ? accountOptionsType[1]
      : accountOptionsType[0];
  },
  set(value) {
    if (user.value) {
      user.value.role = value.name === "تاجر" ? "merchant" : "customer";
    }
  },
});

watch(
  () => selectedAccountType.value,
  (newVal, oldVal) => {
    if (newVal.name !== oldVal.name) {
      userStore.update({
        role: newVal.name === "تاجر" ? "merchant" : "customer",
      });
    }
  }
);

const storeImage = ref(null);
const emitter = inject("emitter");
const previewUrl = ref(user.value?.store?.image ?? null);

const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    storeImage.value = file;
    previewUrl.value = URL.createObjectURL(file);
  }
};

watch(storeImage, async (newImage) => {
  if (newImage) {
    const formData = new FormData();
    formData.append("image", newImage);
    formData.append("_method", "PUT");

    try {
      const response = await axiosClient.post("/merchant/store", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        emitter.emit("showNotificationAlert", [
          "success",
          "تم تحديث صورة المتجر بنجاح!",
        ]);
      }
    } catch (error) {
      emitter.emit("showNotificationAlert", [
        "error",
        "حدث خطأ أثناء رفع الصورة. حاول مرة أخرى.",
      ]);
    }
  }
});
const city = computed({
  get: () => user.value?.store?.city,
  set: (val) => {
    if (!user.value) return;
    if (!user.value.store) {
      return (user.value.store = { city: val });
    }
    return (user.value.store.city = val);
  },
});

watch(
  () => user.value?.store?.city,
  (newVal) => {
    if (newVal?.id) {
      merchantUpdate({ id: "city_id", value: newVal.id });
    }
  }
);


const update = async (data) => {
  const index = ref(-1);
  const item = items.value.find((i, ind) => {
    index.value = ind;
    return i.id === data.id;
  });
  const oldValue = item?.value;

  if (data.id === "email") {
    const isValidEmail = yup.string().email().isValidSync(data.value);
    if (data.value && !isValidEmail) {
      items.value[index.value].value = oldValue;
      emitter.emit("showNotificationAlert", [
        "error",
        "صيغة البريد الإلكتروني غير صحيحة",
      ]);
      return;
    }
  }

  if (data.id === "phone") {
    const phoneRegex = /^\+97[0-9]{10}$/;
    if (data.value && !phoneRegex.test(data.value)) {
      emitter.emit("showNotificationAlert", [
        "error",
        "رقم الهاتف يجب أن يبدأ بـ +97 ويتبعه 10 أرقام",
      ]);
      items.value[index.value].value = oldValue;
      return;
    }
  }

  try {
    await userStore.update({
      [data.id]: data.value,
    });

    emitter.emit("showNotificationAlert", [
      "success",
      "تم تحديث بيانات المتجر بنجاح!",
    ]);
  } catch (error) {
    item.value = oldValue;
    emitter.emit("showNotificationAlert", [
      "error",
      "حدث خطأ أثناء تحديث البيانات. حاول مرة أخرى.",
    ]);
  }
};

const merchantUpdate = async (data) => {
  try {
    const response = await axiosClient.put("/merchant/store", {
      [data.id]: data.value,
    });
    if (response.status == 200) {
      emitter.emit("showNotificationAlert", [
        "success",
        "تم تحديث بيانات المتجر بنجاح!",
      ]);
    }
  } catch (error) {
  }
};
onMounted(async () => {
  await cityStore.fetchAllCities();
});
</script>

<template>
  <SecondaryTitle label="اعدادات الحساب" class="mb-3" />
  <div class="border rounded-xl p-6 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
    <template v-for="item in items" :key="item.label">
      <SingleSettingAccountBox :label="item.label" v-model:value="item.value" :id="item.id" class="dark:text-white"
        @update="update" />
    </template>
    <div v-if="user?.role != 'admin'"
      class="last-of-type:border-none border-b last-of-type:p-0 pb-3 mt-4 first-of-type:mt-0 dark:border-gray-700">
      <span class="text-gray-600 dark:text-gray-300 font-medium text-[14px] mb-3 block">
        نوع الحساب
      </span>
      <div class="flex justify-between items-center">
        <SelectListBox :options="accountOptionsType" v-model="selectedAccountType" />
        <div class="flex items-center gap-2">
          <span class="text-green-600 dark:text-green-400">
            <UserIcon class="w-5" v-if="selectedAccountType.name === 'مستهلك'" />
            <ShoppingBagIcon class="w-5 h-5" v-else />
          </span>
          <span class="text-[14px] font-normal text-gray-600 dark:text-gray-300">
            {{ selectedAccountType.label }}
          </span>
        </div>
      </div>
    </div>
    <template v-if="selectedAccountType.name == 'تاجر'">
      <template v-for="item in merchantSettings" :key="item.label">
        <SingleSettingAccountBox :id="item.id" :label="item.label" v-model:value="item.value" class="dark:text-white"
          @update="merchantUpdate" />
      </template>
      <div class="last-of-type:border-none border-b last-of-type:p-0 pb-3 mt-4 first-of-type:mt-0 dark:border-gray-700">
        <div class="flex flex-col gap-2">
          <span class="text-gray-600 dark:text-gray-300 font-medium text-[14px] mb-3 block">
            موقع المتجر
          </span>
          <SelectListBox class="w-full" v-model="city" :options="cities" label="اختر المدينة التي بها متجرك " />
        </div>
      </div>
      <div class="last-of-type:border-none border-b last-of-type:p-0 pb-3 mt-4 first-of-type:mt-0 dark:border-gray-700">
        <div class="flex flex-col gap-2">
          <div class="flex justify-between items-center">
            <span class="text-gray-600 dark:text-gray-300 font-medium text-[14px] mb-3 block">
              صورة المتجر
            </span>
            <label for="store_image"
              class="w-fit border rounded-lg py-2 px-4 text-[12px] font-medium transition cursor-pointer border-gray-200 hover:bg-gray-100 focus:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
              {{
                user?.store?.image || previewUrl ? "تعديل الصورة" : "اضافة صورة"
              }}
            </label>
            <input type="file" hidden id="store_image" accept="image/*" @change="handleImageChange" />
          </div>
          <div v-if="previewUrl" class="mt-4">
            <img :src="previewUrl" alt="معاينة الصورة" class="w-1/3 object-cover rounded-md mx-auto" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>