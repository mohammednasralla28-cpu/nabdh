<script setup>
import { computed, inject, onMounted, reactive, ref, watch } from "vue";
import ShowProductDialog from "./ShowProductDialog.vue";
import ProductsSwiperDisplay from "./global/ProductsSwiperDisplay.vue";
import ShowAllProductButton from "./global/ShowAllProductButton.vue";
import TitleProductsSection from "./global/TitleProductsSection.vue";
import ProductGridDisplay from "./global/ProductGridDisplay.vue";
import { ShoppingBagIcon } from "@heroicons/vue/24/outline";
import AddProductDialog from "./AddProductDialog.vue";
import axiosClient from "../../axiosClient";
import AddProductButton from "../../views/front/AddProductButton.vue";
import AddOrEditOfferDialog from "./AddOrEditOfferDialog.vue";
import ConfirmDeleteDialog from "../dashboard/global/ConfirmDeleteDialog.vue";

const data = ref({});
const loading = ref(false);

const showProductDialog = reactive({
  dialog: false,
  product_id: 0,
});
const confirmDelDialog = reactive({
  dialog: false,
  product: null,
  type: "product",
  title: "حذف المنتج",
  message:
    "هل أنت متأكد أنك تريد حذف هذا المنتج؟ هذا الإجراء لا يمكن التراجع عنه",
});

const buttonLabel = ref("عرض الكل");
const addProduct = ref(false);
const store = ref([]);
const addDiscount = reactive({
  dialog: false,
  product: {},
});

const showProduct = (payload) => {
  showProductDialog.dialog = true;
  showProductDialog.product_id = typeof payload === 'object' && payload !== null ? payload.id : payload;
};
const addDiscountDialog = (product) => {
  showProductDialog.dialog = false;
  addDiscount.dialog = true;
  addDiscount.product = product;
};
const emitter = inject("emitter");

const confirmDel = async () => {
  try {
    if (confirmDelDialog.type == "product") {
      const response = await axiosClient.delete(
        `merchant/store/products/${confirmDelDialog.product.id}`
      );
      if (response.status == 200) {
        emitter.emit("showNotificationAlert", [
          "success",
          `تم حذف المنتج بنجاح من متجرك!`,
        ]);
        // Emit event to update other sections
        emitter.emit("productDeleted", confirmDelDialog.product.id);
        await fetchProducts();
      }
    } else if (confirmDelDialog.type == "offer") {
      const offerId = confirmDelDialog.product.active_offer?.id;
      
      if (!offerId) {
        throw new Error("Offer ID is missing");
      }
      
      const response = await axiosClient.delete(
        `merchant/offers/${offerId}`
      );
      
      
      if (response.status == 200 || response.status == 204) {
        emitter.emit("showNotificationAlert", [
          "success",
          `تم حذف العرض بنجاح!`,
        ]);
        // Emit event to update other sections in real-time
        emitter.emit("offerDeleted", {
          productId: confirmDelDialog.product.id,
          offerId: offerId
        });
        await fetchProducts();
      }
    }
  } catch (e) {
    const errorMessage = e.response?.data?.message || "حدث خطأ أثناء الحذف. حاول مرة أخرى.";
    emitter.emit("showNotificationAlert", [
      "error",
      errorMessage,
    ]);
  }
};
const productEdit = ref({
  product_id: null,
});

const showConfirmDialog = (product) => {
  showProductDialog.dialog = false;
  confirmDelDialog.product = product;
  confirmDelDialog.title = "حذف المنتج";
  confirmDelDialog.message =
    "هل أنت متأكد أنك تريد حذف هذا المنتج؟ هذا الإجراء لا يمكن التراجع عنه";
  confirmDelDialog.type = "product";
  confirmDelDialog.dialog = true;
};
const editProduct = (product) => {
  productEdit.value = product;
  showProductDialog.dialog = false;
  addProduct.value = true;
};

const deleteDiscountDialog = (product) => {
  showProductDialog.dialog = false;
  confirmDelDialog.product = product;
  confirmDelDialog.title = "هل أنت متأكد من حذف العرض؟";
  confirmDelDialog.message = `سيتم حذف العرض المرتبط بالمنتج "${product.name}" بشكل نهائي. لا يمكن التراجع عن هذه العملية.`;
  confirmDelDialog.type = "offer";
  confirmDelDialog.dialog = true;
};
const showAll = ref(false);
const storeProductIds = computed(() =>
  data.value?.data
    ?.map((p) => p.product_id)
    .filter((id) => id !== productEdit.value?.product_id)
);

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
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    const response = await axiosClient.get(
      `merchant/store/products?page=${page}&_t=${timestamp}`
    );
    data.value = response.data.products;
    store.value = response.data.store;
    // Preload images before hiding skeleton
    await preloadImages(data.value.data);
  } catch (e) {
  } finally {
  }
};

onMounted(async () => {
  loading.value = true;
  await fetchProducts();
  loading.value = false;
});
</script>

<template>
  <TitleProductsSection :icon="ShoppingBagIcon" title="منتجاتي">
    <template #button>
      <div class="flex gap-4 items-center justify-between">
        <AddProductButton @add-product="
          productEdit.product_id = 0;
        addProduct = true;
        " />
        <ShowAllProductButton v-if="data?.data?.length >= 5" @showAll="($event) => (showAll = $event)" />
      </div>
    </template>
  </TitleProductsSection>
  <div class="" v-if="loading || Object.keys(data).length">
    <ProductsSwiperDisplay v-if="!showAll" @showProduct="showProduct($event)" :products="data.data" :loading="loading" />
    <ProductGridDisplay @showProduct="showProduct($event)" :products="data.data" v-model="data.current_page"
      :last-page="data.last_page" :loading="loading" v-else />
  </div>
  <div class="flex justify-center items-center h-24" v-else-if="!loading && !Object.keys(data).length">
    <div>
      <span class="text-gray-700 dark:text-gray-300 font-normal block mb-4">لا يوجد لديك منتجات</span>
      <AddProductButton @add-product="addProduct = true" />
    </div>
  </div>
  <ShowProductDialog v-model="showProductDialog.dialog" :product-id="showProductDialog.product_id" :is-for-me="true"
    @deleteProduct="showConfirmDialog($event)" @editProduct="editProduct($event)"
    @addDiscount="addDiscountDialog($event)" @deleteDiscount="deleteDiscountDialog($event)" />
  <AddProductDialog v-model="addProduct" @fetch-products="fetchProducts" :productsIds="storeProductIds"
    v-model:productEdit="productEdit" />
  <AddOrEditOfferDialog v-model="addDiscount.dialog" @fetch-products="fetchProducts" :product="addDiscount.product" />
  <ConfirmDeleteDialog v-model="confirmDelDialog.dialog" :title="confirmDelDialog.title"
    :message="confirmDelDialog.message" @confirm="confirmDel" />
</template>

<style lang="scss" scoped>
.swiper,
.swiper-wrapper,
.swiper-slide {
  overflow: visible !important;
}

.plus-icon {
  &:hover {
    span {
      display: block;
    }
  }
}
</style>