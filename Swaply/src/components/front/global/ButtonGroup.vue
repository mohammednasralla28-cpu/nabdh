<script setup>
import { ArrowTrendingUpIcon } from "@heroicons/vue/24/solid";
import { ArrowsRightLeftIcon, UserIcon } from "@heroicons/vue/24/outline";
import { BellIcon } from "@heroicons/vue/24/outline";
import SingleButtonGroup from "./SingleButtonGroup.vue";
import { inject, onMounted, onUnmounted, ref } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useNotificationStore } from "../../../stores/notification";


const emitter = inject("emitter");
const isFixed = ref(false);
const buttonGroup = ref(null);
const route = useRoute();
let hiddenButtonHandler = null;

const handleScroll = () => {
  if (route.name === "personal_profile") {
    return;
  }
  const scrollY = window.scrollY;
  // Make it sticky after scrolling past 80px
  isFixed.value = scrollY >= 80;
};

const notificationStore = useNotificationStore();
const { lastNotificationUnreadCount } = storeToRefs(notificationStore);


onMounted(() => {
  hiddenButtonHandler = (event) => {
    // Guard clause: ensure buttonGroup ref is available
    if (!buttonGroup.value) return;

    if (event) {
      // Lower z-index when needed
      buttonGroup.value.style.zIndex = "1";
      return;
    }

    // Restore original z-index
    buttonGroup.value.style.zIndex = isFixed.value ? "100000" : "10000";
  };

  emitter.on("hiddenButton", hiddenButtonHandler);
  window.addEventListener("scroll", handleScroll);

  // Check initial scroll position on mount
  handleScroll();
});

onUnmounted(() => {
  if (hiddenButtonHandler) {
    emitter.off("hiddenButton", hiddenButtonHandler);
  }
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <div ref="buttonGroup"
    class="flex items-center justify-center dark:shadow-white/5 bg-white/80 backdrop-blur-md h-[4.25rem] rounded-2xl overflow-hidden space-x-4 dark:bg-gray-700/80 shadow-md p-0 left-0 right-0 mx-auto w-fit transition-all duration-300 ease-in-out"
    :class="[
      isFixed || route.name === 'personal_profile'
        ? 'fixed top-2 z-[100000]'
        : 'absolute top-20 z-[10000]',
    ]">
    <single-button-group title="الاسعار" name="home">
      <template #icon>
        <ArrowTrendingUpIcon class="w-6 h-6 text-black dark:text-white" />
      </template>
    </single-button-group>
    <single-button-group title="التنبيهات" name="notifications">
      <template #icon>
        <BellIcon class="w-6 h-6 text-black dark:text-white" />
        <span v-if="lastNotificationUnreadCount > 0"
          class="absolute -top-[2px] -right-[2px] bg-black dark:bg-blue-700 dark:text-white rounded-lg text-white w-4 h-4 flex items-center justify-center text-[10px] font-medium">{{
            lastNotificationUnreadCount }}</span>
      </template>
    </single-button-group>
    <single-button-group title="المقايضة" name="exchange">
      <template #icon>
        <ArrowsRightLeftIcon class="w-6 h-6 text-black dark:text-white" />
      </template>
    </single-button-group>
    <single-button-group title="الملف الشخصي" name="personal_profile">
      <template #icon>
        <UserIcon class="w-6 h-6 text-black dark:text-white" />
      </template>
    </single-button-group>
  </div>
</template>
