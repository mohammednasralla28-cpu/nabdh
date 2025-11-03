<script setup>
import { ArrowTrendingUpIcon } from "@heroicons/vue/24/solid";
import { onMounted, onUnmounted, reactive, ref, watch, inject } from "vue";
import ShowProductDialog from "./ShowProductDialog.vue";
import ProductsSwiperDisplay from "./global/ProductsSwiperDisplay.vue";
import ShowAllProductButton from "./global/ShowAllProductButton.vue";
import TitleProductsSection from "./global/TitleProductsSection.vue";
import ProductGridDisplay from "./global/ProductGridDisplay.vue";
import axiosClient from "../../axiosClient";
import { echo } from "../../echo";

const showProductDialog = reactive({
  dialog: false,
  product_id: 0,
});

const showProduct = (payload) => {
  const id = typeof payload === 'object' && payload !== null ? payload.id : payload;
  if (!id || Number.isNaN(Number(id))) return;
  showProductDialog.product_id = id;
  Promise.resolve().then(() => {
    showProductDialog.dialog = true;
  });
};
const data = ref({});
const loading = ref(false);
const emitter = inject("emitter");

const showAll = ref(false);

// Throttle mechanism to avoid too many updates
let updateQueue = new Map();
let updateTimeout = null;

const processUpdateQueue = () => {
  if (updateQueue.size === 0) return;
  
  // Process all queued updates at once
  updateQueue.forEach((newPrice, productId) => {
    updateProductPrice(productId, newPrice);
  });
  
  updateQueue.clear();
};

const updateProductPrice = (productId, newPrice) => {
  if (!data.value.data) return;
  
  // Find and update the product in the current data
  const productIndex = data.value.data.findIndex(p => p.id === productId);
  if (productIndex !== -1) {
    // Update the price while maintaining reactivity
    data.value.data[productIndex].price = newPrice;
  }
};

const handlePriceUpdate = (event) => {
  // Add to queue instead of updating immediately
  updateQueue.set(event.product_id, event.new_price);
  
  // Clear existing timeout and set a new one
  // This batches multiple updates that happen within 500ms
  if (updateTimeout) {
    clearTimeout(updateTimeout);
  }
  
  updateTimeout = setTimeout(() => {
    processUpdateQueue();
    updateTimeout = null;
  }, 500); // Wait 500ms before processing updates
};

watch(
  () => data.value.current_page,
  async (newPage) => {
    if (newPage) {
      await fetchProducts(newPage);
    }
  }
);

const preloadImages = async (products) => {
  if (!products || !products.length) return;
  
  const imagePromises = products.map((product) => {
    return new Promise((resolve) => {
      if (!product.image) {
        resolve();
        return;
      }
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve(); // Resolve even on error to not block UI
      img.src = product.image;
    });
  });
  
  await Promise.all(imagePromises);
};

const fetchProducts = async (page = 1) => {
  try {
    const response = await axiosClient.get(
      `/product/last-products?page=${page}`
    );
    data.value = response.data;
    // Preload images before hiding skeleton
    await preloadImages(data.value.data);
  } catch (e) {
  } finally {
  }
};

const handleOfferDeleted = (payload) => {
  if (!data.value.data) return;
  
  // Update the product to remove the offer information
  const productIndex = data.value.data.findIndex(p => p.id === payload.productId);
  if (productIndex !== -1) {
    // Remove active_offer from the product
    data.value.data[productIndex].active_offer = null;
  }
};

const handleProductDeleted = (productId) => {
  if (!data.value.data) return;
  
  // Remove the product completely if it was deleted
  const productIndex = data.value.data.findIndex(p => p.id === productId);
  if (productIndex !== -1) {
    data.value.data.splice(productIndex, 1);
  }
};

onMounted(async () => {
  loading.value = true;
  await fetchProducts();
  loading.value = false;
  
  // Listen to price updates on the prices channel
  echo.channel('prices')
    .listen('.PriceUpdated', handlePriceUpdate);
  
  // Listen to offer and product deletion events
  emitter.on("offerDeleted", handleOfferDeleted);
  emitter.on("productDeleted", handleProductDeleted);
});

onUnmounted(() => {
  // Clean up the event listener when component is destroyed
  echo.leave('prices');
  
  // Clear any pending updates
  if (updateTimeout) {
    clearTimeout(updateTimeout);
  }
  updateQueue.clear();
  
  // Remove event listeners
  emitter.off("offerDeleted", handleOfferDeleted);
  emitter.off("productDeleted", handleProductDeleted);
});
</script>

<template>
  <TitleProductsSection :icon="ArrowTrendingUpIcon" title="آخر الاسعار">
    <template #button v-if="data?.data?.length >= 5">
      <ShowAllProductButton @showAll="($event) => (showAll = $event)" />
    </template>
  </TitleProductsSection>
  <div class="" v-if="loading || data?.data?.length">
    <ProductsSwiperDisplay v-if="!showAll" @showProduct="showProduct($event)" :products="data.data" :loading="loading" />
    <ProductGridDisplay :products="data.data" v-model="data.current_page" :last-page="data.last_page"
      @showProduct="showProduct($event)" :loading="loading" v-else />
  </div>
  <div class="flex justify-center items-center h-24" v-else-if="!loading && !data?.data?.length">
    <div>
      <span class="text-gray-700 dark:text-gray-300 font-normal block mb-4">لم يتم حتى الان اضافة اي منتجات</span>
    </div>
  </div>
  <ShowProductDialog v-model="showProductDialog.dialog" :productId="+showProductDialog.product_id" />
</template>

<style scoped>
.swiper,
.swiper-wrapper,
.swiper-slide {
  overflow: visible !important;
}
</style>