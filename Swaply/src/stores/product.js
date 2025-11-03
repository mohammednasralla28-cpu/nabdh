// stores/product.js
import { defineStore } from "pinia";
import { ref } from "vue";
import axiosClient from "../axiosClient";

export const useProductStore = defineStore("product", () => {
  const products = ref([]);
  const loading = ref(false);
  const errors = ref({});

  const fetchAllProductsIds = async () => {
    if (Object.keys(products.value).length) {
      return products.value;
    }
    try {
      loading.value = true;
      const response = await axiosClient.get("/products");
      products.value = response.data.products;
    } catch (e) {
    } finally {
      loading.value = false;
    }
  };
  return { products, loading, errors, fetchAllProductsIds };
});
