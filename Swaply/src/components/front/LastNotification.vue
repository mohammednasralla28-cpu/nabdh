<script setup>
import {ref, onMounted } from "vue";
import LastNotificationBox from "./LastNotificationBox.vue";
import NotificationSectionTitle from "./NotificationSectionTitle.vue";
import { useNotificationStore } from "../../stores/notification";
import { storeToRefs } from "pinia";


const isShowAll = ref(false);

const notificationStore = useNotificationStore();
const { lastNotifications } = storeToRefs(notificationStore);

onMounted(async () => {
  await notificationStore.fetchLastNotifications();
});
</script>

<template>
  <div
    class="px-6 pt-8 h-[330px] pb-2 rounded-[20px] dark:shadow-[inset_0_4px_10px_rgba(0,0,0,0.01)] dark:shadow-slate-700 bg-white dark:bg-gray-900"
    :class="{ 'overflow-y-auto': isShowAll, 'overflow-y-hidden': !isShowAll }" v-if="lastNotifications.data">
    <div class="flex items-center justify-between mb-6">
      <NotificationSectionTitle title="الإشعارات الاخيرة" />
      <button v-if="lastNotifications.data.length > 2" @click="isShowAll = !isShowAll"
        class="show-more text-gray-600 dark:text-gray-300 border border-gray-400 dark:border-gray-600 rounded-lg text-[12px] w-[94px] h-8 font-medium bg-gray-100 dark:bg-gray-700 transition-all hover:bg-gray-200 dark:hover:bg-gray-600">
        {{ isShowAll ? "عرض أقل" : "عرض الكل" }}
      </button>
    </div>
    <template v-if="lastNotifications.data.length > 0">
      <template v-for="item in lastNotifications.data" :key="item.id">
        <LastNotificationBox :title="item.data.title" :time="item.created_at" :is-decrease="item.data.status == 'lt'"
          :is-increase="item.data.status == 'gt'" :is-urgent="item.isUrgent" />
      </template>
    </template>
    <template v-else>
      <p class="flex justify-center items-center h-[50%] text-sm font-normal text-gray-800 dark:text-gray-200">
        لا يوجد اي إشعارات حتى الان
      </p>
    </template>
  </div>
</template>


<style lang="scss" scoped>
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.5);
}

.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.3) transparent;
}
</style>