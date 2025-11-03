// services/dataLoader.js
import { useProductStore } from "../stores/product";
import { useCategoryStore } from "../stores/category";
import { useCityStore } from "../stores/city";
import { useNotificationStore } from "../stores/notification";

class DataLoader {
  constructor() {
    this.loadingPromises = new Map();
  }

  async loadHomePageData() {
    const cacheKey = "homePageData";

    // Check if already loading
    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey);
    }

    const loadingPromise = this._loadHomePageData();
    this.loadingPromises.set(cacheKey, loadingPromise);

    try {
      const result = await loadingPromise;
      return result;
    } finally {
      this.loadingPromises.delete(cacheKey);
    }
  }

  async _loadHomePageData() {
    const productStore = useProductStore();
    const categoryStore = useCategoryStore();
    const cityStore = useCityStore();
    const notificationStore = useNotificationStore();

    // Load all data in parallel
    const promises = [
      productStore.fetchAllProductsIds(),
      categoryStore.fetchAllCategoriesIds(),
      cityStore.fetchAllCities(),
    ];

    // Only load notifications if user is authenticated
    if (notificationStore) {
      promises.push(notificationStore.fetchLastNotifications());
    }

    try {
      await Promise.allSettled(promises);
      return {
        success: true,
        loadedStores: ["product", "category", "city", "notification"],
      };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }

  async loadUserSpecificData() {
    const cacheKey = "userSpecificData";

    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey);
    }

    const loadingPromise = this._loadUserSpecificData();
    this.loadingPromises.set(cacheKey, loadingPromise);

    try {
      const result = await loadingPromise;
      return result;
    } finally {
      this.loadingPromises.delete(cacheKey);
    }
  }

  async _loadUserSpecificData() {
    const notificationStore = useNotificationStore();

    try {
      const promises = [];

      if (notificationStore) {
        promises.push(notificationStore.fetchLastNotifications());
      }

      await Promise.allSettled(promises);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  clearCache() {
    const productStore = useProductStore();
    const categoryStore = useCategoryStore();
    const cityStore = useCityStore();
    const notificationStore = useNotificationStore();

    productStore.clearCache?.();
    categoryStore.clearCache?.();
    cityStore.clearCache?.();
  }
}

export default new DataLoader();
