<script setup>
import { computed } from "vue";
import useFormats from "../../../mixins/formats";
import CardProduct from "./CardProduct.vue";
import CardProductSkeleton from "./CardProductSkeleton.vue";
import PaginationComponent from "./PaginationComponent.vue";
const props = defineProps({
  products: {
    type: Array,
    default: [],
  },
  modelValue: {
    type: Number,
    default: 1,
  },
  lastPage: {
    type: Number,
    default: 1,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update:modelValue", "showProduct"]);
const currentPage = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
const { getRelativeTime } = useFormats();
</script>

<template>
  <div class="mt-8">
    <!-- Loading Skeleton -->
    <div v-if="loading"
      class="container mx-auto mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
      <div v-for="i in 10" :key="i">
        <CardProductSkeleton />
      </div>
    </div>

    <!-- Actual Products -->
    <div v-else
      class="container mx-auto mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
      <div v-for="product in products" :key="product.id">
        <CardProduct :id="+product.id" :image="product.image" :price="+product.price" :name="product.name"
          :description="product.description" :store-name="product.store?.address"
          :time="getRelativeTime(product.updated_at)" v-model:is-favorite="product.is_favorite"
          :offer="product.active_offer" @click="$emit('showProduct', product.id)" />
      </div>
    </div>
    <div class="container mx-auto">
      <PaginationComponent v-model="currentPage" :last-page="lastPage" />
    </div>
  </div>
</template>