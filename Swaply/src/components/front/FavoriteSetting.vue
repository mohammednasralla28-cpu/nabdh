<script setup>
import { ref, watch } from "vue";
import RadioComponent from "./global/RadioComponent.vue";
import SecondaryTitle from "./global/SecondaryTitle.vue";
import SingleFavoriteStructure from "./SingleFavoriteStructure.vue";
import BaseSwitch from "./global/BaseSwitch.vue";
import { useThemeStore } from "../../stores/theme";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../../stores/auth/auth";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const enabled = ref(Boolean(user.value?.recive_notification));
const currencySelected = ref(user.value?.currency || "ILS");
const langs = [
  {
    label: "العربية",
    id: "ar",
  },
  {
    label: "english",
    id: "en",
  },
];

watch(currencySelected, async (newVal) => {
  if (user.value) {
    await authStore.update({ currency: newVal });
    user.value.currency = newVal;
  }
});
watch(enabled, async (newVal) => {
  if (user.value) {
    await authStore.update({ recive_notification: +newVal });
    user.value.recive_notification = newVal;
  }
});
const currency = [
  {
    label: "دولار",
    id: "USD",
  },
  {
    label: "شيكل",
    id: "ILS",
  },
];

const themeStore = useThemeStore();
const theme = storeToRefs(themeStore);
const { currentTheme } = theme;
const themes = themeStore.themes;

// Watch for theme changes and save them
watch(currentTheme, async (newVal) => {
  if (user.value) {
    await themeStore.changeTheme(newVal, true);
  }
});
</script>

<template>
  <SecondaryTitle label="التفضيلات" class="mb-3" />
  <div class="border rounded-xl p-6 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
    <SingleFavoriteStructure title="المظهر" description="اختر مظهر التطبيق">
      <template #action>
        <RadioComponent :items="themes" name="theme" v-model:selected="currentTheme" />
      </template>
    </SingleFavoriteStructure>
    <SingleFavoriteStructure title="الوحدة" description="وحدة قياس الاسعار">
      <template #action>
        <RadioComponent :items="currency" name="currency" v-model:selected="currencySelected" />
      </template>
    </SingleFavoriteStructure>
    <SingleFavoriteStructure title="التنبيهات" description="تفعيل إشعارات الاسعار">
      <template #action>
        <BaseSwitch v-model:model-value="enabled" />
      </template>
    </SingleFavoriteStructure>
  </div>
</template>