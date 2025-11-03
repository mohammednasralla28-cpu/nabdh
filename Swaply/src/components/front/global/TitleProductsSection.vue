<script setup>
import { ArrowTrendingUpIcon } from "@heroicons/vue/24/solid";
import ProductSectionTitle from "../ProductSectionTitle.vue";

const props = defineProps({
  icon: {
    type: [Object, Function],
    default: ArrowTrendingUpIcon,
  },
  title: {
    type: String,
    required: true,
  },
});
</script>
<template>
  <div class="container mx-auto">
    <div class="flex justify-between items-center">
      <ProductSectionTitle :title="title" :icon="icon" />
      <slot name="button" />
    </div>
  </div>
</template>