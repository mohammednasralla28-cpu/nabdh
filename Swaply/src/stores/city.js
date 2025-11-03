// stores/city.js
import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";
import axiosClient from "../axiosClient";
import { useAuthStore } from "./auth/auth";

export const useCityStore = defineStore("city", () => {
  const cities = ref([]);
  const distance = ref([]);
  const loading = ref(false);
  const errors = ref({});
  const { user } = storeToRefs(useAuthStore());

  const fetchAllCities = async () => {
    if (Object.keys(cities.value).length) {
      return cities.value;
    }

    try {
      loading.value = true;
      const response = await axiosClient.get(`/cities`, {
        cache: { ttl: 15 * 60 * 1000 },
      });
      cities.value = response.data.cities;
    } catch (e) {
      errors.value = e;
    } finally {
      loading.value = false;
    }
  };

  const fetchAllCitiesDistances = async () => {
    if (Object.keys(distance.value).length) {
      return distance.value;
    }

    try {
      loading.value = true;
      const response = await axiosClient.get(`/cities/distances`, {
        cache: { ttl: 15 * 60 * 1000 },
      });
      distance.value = response.data.distances;
    } catch (e) {
      errors.value = e;
    } finally {
      loading.value = false;
    }
  };
  const distanceToSpecificCity = (cityId) => {
    const currentUser = user?.value || null;
    if (!currentUser || !currentUser.share_location) {
      return "المسافة غير معروفة";
    }
    if (!cityId) return "المسافة غير معروفة";
    if (!distance.value.length) {
      fetchAllCitiesDistances();
    }
    const userCityId = currentUser.city?.id;
    if (!userCityId) return "المسافة غير معروفة";
    const match = distance.value.find(
      (d) =>
        (d.city_id_one == cityId && d.city_id_two == userCityId) ||
        (d.city_id_one == userCityId && d.city_id_two == cityId)
    );
    if (!match) return "في منطقتك";
    const km = Number(match.distance);
    return Number.isFinite(km) ? km : "في منطقتك";
  };

  return {
    cities,
    loading,
    errors,
    fetchAllCities,
    fetchAllCitiesDistances,
    distanceToSpecificCity,
  };
});
