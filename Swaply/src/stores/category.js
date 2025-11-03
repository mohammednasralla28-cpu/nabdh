// stores/category.js
import { defineStore } from "pinia";
import { ref } from "vue";
import axiosClient from "../axiosClient";

export const useCategoryStore = defineStore("category", () => {
  const categories = ref([]);
  const loading = ref(false);
  const errors = ref({});

  const fetchAllCategoriesIds = async () => {
    if (Object.keys(categories.value).length) {
      return categories.value;
    }

    try {
      loading.value = true;
      const response = await axiosClient.get("/categories", {
        cache: { ttl: 10 * 60 * 1000 },
      });
      categories.value = response.data.categories;
    } catch (e) {
      errors.value = e;
    } finally {
      loading.value = false;
    }
  };

  return { categories, loading, errors, fetchAllCategoriesIds };
});
