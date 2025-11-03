<!-- components/NotificationsContainer.vue -->
<template>
  <div class="fixed top-4 right-4 z-[9999] flex flex-col items-end gap-2">
    <TransitionGroup
      name="notification"
      tag="div"
      class="flex flex-col items-end gap-2">
      <NotificationAlert 
        v-for="note in notifications" 
        :key="note.id" 
        :message="note.message" 
        :type="note.type"
        :duration="note.duration" />
    </TransitionGroup>
  </div>
</template>

<script setup>
import NotificationAlert from "./NotificationAlert.vue";
defineProps({
  notifications: Object,
});
</script>

<style scoped>
/* Transition for notifications appearing/disappearing */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease-out;
}

.notification-enter-from {
  opacity: 0;
  transform: translateY(-100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}

.notification-move {
  transition: transform 0.3s ease;
}
</style>
