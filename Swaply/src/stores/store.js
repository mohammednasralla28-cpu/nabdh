// stores/store.js
import { defineStore } from "pinia";
import { ref} from "vue";
import axiosClient from "../axiosClient";

export const useStore = defineStore("store", () => {
  const categories = ref([]);
  const loading = ref(false);
  const errors = ref({});

  const fetchAllCategoriesIds = async () => {
    if (Object.keys(categories.value).length) {
      return categories.value;
    }

    try {
      loading.value = true;
      const response = await axiosClient.get("/categories");
      categories.value = response.data.categories;
    } catch (e) {
      errors.value = e;
    } finally {
      loading.value = false;
    }
  };

  return { categories, loading, errors, fetchAllCategoriesIds };
});
