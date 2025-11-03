<!-- App.vue -->
<template>
  <div 
    class="app min-h-screen bg-gray-100 dark:bg-gray-800"
    :class="{ 'overflow-hidden': isProfilePage }"
  >
    <router-view />
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useThemeStore } from "./stores/theme";
import { computed, onMounted, watch } from "vue";
import { useAuthStore } from "./stores/auth/auth";
import { useNotificationStore } from "./stores/notification";
import { useRouter } from "vue-router";

const router = useRouter();
const themeStore = useThemeStore();  
const authStore = useAuthStore();
const { user, isAuth } = storeToRefs(authStore);
const notificationStore = useNotificationStore();

// Check if current route is personal_profile
const isProfilePage = computed(() => router.currentRoute.value.name === 'personal_profile');

watch(
  () => isAuth.value,
  async (newVal) => {
    if (newVal) await notificationStore.fetchLastNotifications();
  }
);
onMounted(async () => {
  // Check auth and sync user's theme from database if logged in
  await authStore.checkAuth();
  if (user.value?.theme) {
    themeStore.changeTheme(user.value.theme);
  }
});
</script>


<style lang="scss">
#app {
  max-width: 100vw;
}

nav {
  a {
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
