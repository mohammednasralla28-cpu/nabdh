<script setup>
import { ArrowTrendingUpIcon } from "@heroicons/vue/24/solid";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { reactive, ref } from "vue";
import ProductSectionTitle from "../ProductSectionTitle.vue";
import CardProduct from "./CardProduct.vue";
import ShowProductDialog from "../ShowProductDialog.vue";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import useFormats from "../../../mixins/formats";

const props = defineProps({
  products: {
    type: Array,
    default: [],
  },
});

const { getRelativeTime } = useFormats();
</script>

<template>
  <div class="mt-2 overflow-x-hidden" v-if="products.length">
    <Swiper
      :slidesPerView="5"
      class="mt-6 overflow-visible mx-auto container"
      :spaceBetween="20"
      :modules="[Pagination, Autoplay, Navigation]"
      :pagination="{ el: '.pagination', clickable: true }"
      :navigation="{
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }"
      :loop="products.length >= 5"
      :autoplay="{
        delay: 3000,
        pauseOnMouseEnter: true,
        disableOnInteraction: false,
      }"
      :breakpoints="{
        320: { slidesPerView: 1.5, spaceBetween: 10 },
        500: { slidesPerView: 2, spaceBetween: 10 },
        640: { slidesPerView: 3, spaceBetween: 15 },
        745: { slidesPerView: 3, spaceBetween: 20 },
        768: { slidesPerView: 3.5, spaceBetween: 20 },
        950: { slidesPerView: 3.5, spaceBetween: 20 },
        1024: { slidesPerView: 4, spaceBetween: 20 },
        1280: { slidesPerView: 5, spaceBetween: 20 },
      }"
    >
      <swiper-slide
        v-for="product in products"
        :key="product.id"
        class="swiper-wrapper overflow-visible"
      >
        <CardProduct
          :id="+product.id"
          :image="product.image"
          :price="+product.price"
          :name="product.name"
          :description="product.description"
          :store-name="product.store?.address"
          :time="getRelativeTime(product.updated_at)"
          v-model:is-favorite="product.is_favorite"
          :offer="product.active_offer"
          @click="$emit('showProduct', product.id)"
        />
      </swiper-slide>
      <!-- <div class="pagination"></div> -->
      <div
        class="swiper-button-prev w-10 h-10 flex items-center justify-center rounded-full hover:bg-[rgba(0,0,0,0.35)]  bg-[rgba(0,0,0,0.25)] dark:bg-[rgba(255,255,255,0.35)] dark:hover:bg-[rgba(255,255,255,0.25)] backdrop-blur-sm transition"
      ></div>

      <div
        class="swiper-button-next  w-10 h-10 flex items-center justify-center rounded-full hover:bg-[rgba(0,0,0,0.35)]  bg-[rgba(0,0,0,0.25)] dark:bg-[rgba(255,255,255,0.35)] dark:hover:bg-[rgba(255,255,255,0.25)] backdrop-blur-sm transition"
      ></div>
    </Swiper>
  </div>
</template>

<style scoped >
.swiper,
.swiper-wrapper,
.swiper-slide {
  overflow: visible !important;
}

.swiper-button-prev,
.swiper-button-next {
  width: 46px !important;
  height: 46px !important;
  top: calc(50%) !important;
}
.swiper-button-prev::after,
.swiper-button-next::after {
  /* margin-top: -24px !important; */
  font-size: 18px !important;
  font-weight: bold;
  color: white !important;
}
</style>
