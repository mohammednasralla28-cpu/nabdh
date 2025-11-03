// stores/notification.js
import { defineStore } from "pinia";
import { inject, ref } from "vue";
import axiosClient from "../axiosClient";

export const useNotificationStore = defineStore("notification", () => {
  const notifications = ref([]);
  const lastNotifications = ref([]);
  const lastNotificationUnreadCount = ref(0);
  const loading = ref(false);
  const status = ref(400);
  const errors = ref({});
  const emitter = inject("emitter");
  const addNotification = async (productId, type, price) => {
    try {
      loading.value = true;
      const response = await axiosClient.post("/notifications", {
        product_id: productId,
        type: type,
        target_price: price,
      });
      if ((response.data.status = 201)) {
        status.value = 201;
        await fetchNotification();
        emitter.emit("showNotificationAlert", [
          "success",
          "تم اضافة تنبيه جديد بنجاح!",
        ]);
      }
    } catch (e) {
    } finally {
      loading.value = false;
    }
  };

  const fetchNotification = async () => {
    try {
      const response = await axiosClient.get("/notifications");
      notifications.value = response.data.notifications;
    } catch (e) {
    }
  };

  const fetchLastNotifications = async () => {
    try {
      const response = await axiosClient.get("/active-notifications");
      if (response.status == 200) {
        lastNotificationUnreadCount.value = response.data.unread_count;
        lastNotifications.value = response.data.notifications;
      }
    } catch (e) {
    }
  };
  const markAsRead = async () => {
    try {
      const response = await axiosClient.patch("/notifications/mark-as-read");
      if (response.status == 200) {
        lastNotificationUnreadCount.value = 0;
      }
    } catch (e) {
    }
  };

  return {
    notifications,
    loading,
    errors,
    status,
    lastNotificationUnreadCount,
    lastNotifications,
    markAsRead,
    addNotification,
    fetchNotification,
    fetchLastNotifications,
  };
});
