<script setup>
import { storeToRefs } from "pinia";
import AuthFeaturesSection from "../../components/front/AuthFeaturesSection.vue";
import AppFooter from "../../components/front/global/AppFooter.vue";
import HeaderPage from "../../components/front/global/HeaderPage.vue";
import HomeNav from "../../components/front/HomeNav.vue";
import LastPricing from "../../components/front/LastPricing.vue";
import MerchantProductsSection from "../../components/front/MerchantProductsSection.vue";
import MyFavoritesSection from "../../components/front/MyFavoritesSection.vue";
import OfferSection from "../../components/front/OfferSection.vue";
import SearchSection from "../../components/front/SearchSection.vue";
import { useAuthStore } from "../../stores/auth/auth";

const authStore = useAuthStore();
const { isAuth, user } = storeToRefs(authStore);
</script>

<template>
  <div class="dark:bg-gray-800">
    <HeaderPage>
      <HomeNav />
    </HeaderPage>
    <div class="container mx-auto mt-20">
      <SearchSection class="" />
    </div>
  </div>

  <div class="py-14 dark:bg-gray-800">
    <LastPricing />
  </div>

  <div class="dark:bg-gray-800">
    <OfferSection />
  </div>
  <div class="dark:bg-gray-800 pt-14" v-if="user?.role == 'merchant' && user?.store?.status == 'active'">
    <MerchantProductsSection />
  </div>
  <div class="dark:bg-gray-800 pt-14 pb-4" v-if="isAuth">
    <MyFavoritesSection />
  </div>

  <div class="pt-14 dark:bg-gray-800" v-if="!isAuth">
    <AuthFeaturesSection />
  </div>
  <div class="bg-gray-200 dark:bg-gray-700 mt-12 rounded-t-xl">
    <AppFooter />
  </div>
</template>
