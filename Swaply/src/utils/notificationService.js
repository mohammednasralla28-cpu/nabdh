// src/utils/notificationService.js
import { reactive } from "vue";

export const notifications = reactive([]);

export function addNotification(message, type = "info", duration = 3000) {
  const id = Date.now() + Math.random();
  notifications.push({ id, message, type, duration });

  setTimeout(() => {
    const index = notifications.findIndex((n) => n.id === id);
    if (index !== -1) notifications.splice(index, 1);
  }, duration);
}
