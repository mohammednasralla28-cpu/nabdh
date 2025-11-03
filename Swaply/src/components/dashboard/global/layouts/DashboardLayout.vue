<script setup>
import {
  ArchiveBoxIcon,
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  BuildingStorefrontIcon,
  FlagIcon,
  HomeIcon,
  ShoppingBagIcon,
  UsersIcon,
} from "@heroicons/vue/24/outline";
import { inject, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../../../stores/auth/auth";
import NotificationsContainer from "../../../front/global/NotificationsContainer.vue";
const sideOpen = ref(false);
const linksSide = ref(null);
const authStore = useAuthStore();
const toggleSide = () => {
  sideOpen.value = !sideOpen.value;
};
const handleClickOutside = (event) => {
  if (linksSide.value && !linksSide.value.contains(event.target)) {
    sideOpen.value = false;
  }
};
const router = useRouter();
const links = [
  {
    label: "الصفحة الرئسية",
    link_name: "dashboard",
    icon: HomeIcon,
  },
  {
    label: "التصنيفات",
    link_name: "dashboard-category",
    icon: ArchiveBoxIcon,
  },
  {
    label: "المنتجات",
    link_name: "dashboard-product",
    icon: ShoppingBagIcon,
  },
  {
    label: "المتاجر",
    link_name: "dashboard-store",
    icon: BuildingStorefrontIcon,
  },
  {
    label: "المستخدمين",
    link_name: "dashboard-user",
    icon: UsersIcon,
  },
  {
    label: "الابلاغات",
    link_name: "dashboard-report",
    icon: FlagIcon,
  },
];

const emitter = inject("emitter");
const notifications = reactive([]);
onMounted(() => {
  emitter.on(
    "showNotificationAlert",
    ([type = "info", message, duration = 4000]) => {
      const id = Date.now() + Math.random();
      notifications.push({ id, message, type, duration });
      setTimeout(() => {
        const index = notifications.findIndex((n) => n.id === id);
        if (index !== -1) notifications.splice(index, 1);
      }, duration);
    }
  );
});

const goToPageName = (name) => {
  sideOpen.value = false;
  router.push({ name: name });
};

const logout = async () => {
  await authStore.logout();
};
</script>
<template>
  <nav class="h-[76px] bg-gray-100 dark:bg-gray-900 shadow">
    <div class="flex justify-between items-center h-full container mx-auto px-2">
      <div class="flex gap-3 items-center">
        <div
          class="icon cursor-pointer transition-colors text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          @click="toggleSide()">
          <Bars3Icon class="w-6" />
        </div>
        <span
          class="text-blue-700 dark:text-blue-400 font-medium text-[20px] cursor-pointer transition-colors hover:text-blue-800 dark:hover:text-blue-300"
          @click="router.push({ name: 'dashboard' })">
          لوحة التحكم
        </span>
      </div>
      <span class="cursor-pointer
        flex
        items-center
        gap-1
        font-medium
        text-[14px]
        border
        rounded-md
        py-2
        px-4
      text-white
      bg-red-600
      border-red-600
        ring-1
      ring-red-600
        ring-offset-0
      ring-offset-white
      dark:ring-offset-gray-900
        hover:ring-offset-2
        transition
        duration-200
        " @click="logout">
        <ArrowRightStartOnRectangleIcon class="w-6" />
        <span> تسجيل الخروج </span>
      </span>
    </div>
  </nav>

  <aside class="relative">
    <ul ref="links-side"
      class="bg-white dark:bg-gray-800 fixed w-[250px] top-0 bottom-0 z-20 transition-all duration-300" :class="{
        'right-0': sideOpen,
        '-right-full': !sideOpen,
      }">
      <li
        class="title text-blue-700 dark:text-blue-300 text-[20px] font-medium border-b border-gray-100 dark:border-gray-700 mt-8 text-center pb-6 block">
        لوحة التحكم
      </li>
      <li v-for="link in links" :key="link.link_name"
        class="link relative px-3 py-4 flex gap-3 font-normal items-center cursor-pointer text-gray-600 dark:text-gray-300 transition-all duration-300 hover:text-gray-800 dark:hover:text-white border-b border-gray-200 dark:border-gray-700 last-of-type:border-none"
        :class="{
          'bg-blue-500 text-white dark:bg-blue-700 dark:text-white hover:text-white':
            router.currentRoute.value.name == link.link_name,
        }" @click="goToPageName(link.link_name)">
        <component :is="link.icon" class="w-6" />
        <span>{{ link.label }}</span>
      </li>
    </ul>
    <div class="overlay fixed top-0 left-0 h-screen w-screen z-10" :class="{
      'bg-black/20': sideOpen,
      hidden: !sideOpen,
    }" @click="toggleSide()"></div>
  </aside>
  <div class="bg-gray-50 dark:bg-gray-800">
    <main class="container mx-auto min-h-[calc(100vh-76px)] px-2">
      <slot />
    </main>
  </div>

  <NotificationsContainer :notifications="notifications" />
</template>

<style lang="scss" scoped>
.link {
  &::after {
    content: "";
    transition: 0.3s all;
    position: absolute;
    right: 0;
    top: 0;
    background-color: currentColor;
    opacity: 0.05;
    height: 100%;
    width: 0%;
  }

  &:hover {
    &::after {
      width: 100%;
    }
  }
}
</style>