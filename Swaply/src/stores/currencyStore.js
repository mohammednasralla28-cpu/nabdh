// stores/currencyStore.js
import { defineStore } from "pinia";
import { ref } from "vue";
import useFormats from "../mixins/formats";

export const useCurrencyStore = defineStore("currency", () => {
    const rateUSD = ref(0);
    const { currencyFormat } = useFormats();

    const fetchRate = async () => {
        try {
            const res = await fetch("https://open.er-api.com/v6/latest/ILS");
            const data = await res.json();
            rateUSD.value = data.rates.USD;
            setTimeout(() => {
                rateUSD.value = 0;
            }, 15 * 60 * 1000);
        } catch (err) {
            rateUSD.value = 0;
        }
    };

    const convertToUSD = async (priceILS) => {
        if (!rateUSD.value) {
            await fetchRate();
        };
        const price = (priceILS * rateUSD.value).toFixed(2);
        return currencyFormat(price);
    };

    return { rateUSD, fetchRate, convertToUSD };
});
