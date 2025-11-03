<script setup>
import { onMounted } from "vue";
import ActiveNotificationBox from "./ActiveNotificationBox.vue";
import NotificationSectionTitle from "./NotificationSectionTitle.vue";
import { useNotificationStore } from "../../stores/notification";
import { storeToRefs } from "pinia";

const notificationStore = useNotificationStore();
const { notifications } = storeToRefs(notificationStore);


onMounted(async () => {
  await notificationStore.fetchNotification();
});
</script>

<template>
  <div
    class="px-6 pt-8 pb-6 rounded-[20px] overflow-y-auto shadow-md dark:shadow-[inset_0_4px_10px_rgba(0,0,0,0.01)] dark:shadow-slate-700 shadow-slate-200 h-full max-h-[644px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <NotificationSectionTitle title="التنبيهات النشطة" class="mb-6" />
    <template v-if="notifications.length">
      <template v-for="item in notifications" :key="item.title">
        <ActiveNotificationBox :id="item.id" :title="item.product?.name" v-model:is-active="item.status" :whenRun="item.type === 'lt'
            ? `أقل من ${+item.target_price}`
            : `أكبر من ${+item.target_price}`
          " :alerted="Boolean(item.is_triggered)" />
      </template>
    </template>
    <template v-else>
      <p class="flex justify-center items-center h-[90%] text-sm font-normal text-gray-800 dark:text-gray-200">
        لم تقم حتى الآن بإضافة أي تنبيه
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