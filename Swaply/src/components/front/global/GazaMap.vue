<template>
  <svg viewBox="0 0 300 300" role="img" aria-labelledby="mapTitle mapDesc" class="text-[6px] max-h-screen">
    <g transform="translate(50,10)" class="stroke-[rgba(0,0,0,0.25)] dark:stroke-white">
      <path
        d="M159 14.7C153.2 22.8 146.1 32.2 143.1 35.5C140.2 38.8 132.7 48 126.5 56C120.3 64 113.1 72.5 110.5 75C107.9 77.5 104 82 101.7 85C94.8 94.3 75.5 116.3 67.3 124.1C63 128.2 46.2 144.8 30 161L0.5 190.5L5.7 198C8.6 202.1 12.3 207.2 13.9 209.3C15.8 211.6 17.4 215.5 18.4 219.8C19.9 226.5 30.9 263.2 31.5 263.9C32.2 264.6 43.2 254.6 44.5 252C45.4 250.2 50.3 246.9 59.9 241.6L73.9 233.9L78 225.7C82 217.8 82.2 217.6 88.2 215.1C96.1 211.8 98.1 208.6 98.1 199.7C98.1 196.2 97 188.9 95.6 183.2C94.2 177.7 93 170.8 93 167.9C93 163.1 93.6 161.9 100.4 151.6C107 141.8 110.8 137.7 133 116.5C146.9 103.3 158.7 92.2 159.4 91.8C160.1 91.4 163.5 87.7 166.9 83.6C172.9 76.5 175.2 74.7 193.4 62.7C196.1 60.9 201.5 56.2 205.4 52.1C211.9 45.4 212.5 44.3 213 39.8L213.6 34.8L208 30.1C203 25.8 183.1 9.70001 174.2 2.70001C172.2 1.20001 170.4 0 170.1 0C169.8 0 164.8 6.7 159 14.7Z"
        class="fill-[rgba(255,255,255,0.9)] dark:fill-[rgba(255,255,255,0.1)]" />
    </g>

    <g v-for="city in citiesShowInMap" :key="city.name" class="poi cursor-default" tabindex="0" :data-key="city.name"
      :transform="`translate(${city.x},${city.y})`">
      <circle r="2.5" class="fill-red-600 cursor-default pointer-events-none"></circle>
      <text x="14" y="-6"
        class="font-bold text-[6px] fill-black dark:fill-white cursor-pointer stroke-white dark:stroke-black stroke-[0.5px]"
        style="paint-order: stroke;">
        {{ city.name }}
      </text>
    </g>
  </svg>
</template>

<script setup>
import { ref, computed } from "vue";
const props = defineProps({
  cities: Array,
});

const citiesExistsInMap = [
  { name: "بيت لاهيا", x: 215, y: 40 },
  { name: "بيت حانون", x: 235, y: 55 },
  { name: "جباليا", x: 190, y: 70 },
  { name: "غزة", x: 167, y: 94 },
  { name: "النصيرات", x: 135, y: 130 },
  { name: "دير البلح", x: 114, y: 161 },
  { name: "المغازي", x: 138, y: 158 },
  { name: "البريج", x: 148, y: 143 },
  { name: "خان يونس", x: 102, y: 191 },
  { name: "رفح", x: 69, y: 224 },
];
const citiesShowInMap = computed(() => {
  if (!props.cities) return [];
  return props.cities
    .map((city) => {
      const found = citiesExistsInMap.find(
        (c) => c.name.toLowerCase() === city.toLowerCase()
      );
      return found ? found : null;
    })
    .filter((c) => c !== null);
});

const isDark = computed(() =>
  document.documentElement.classList.contains("dark")
);
</script>

<style scoped>
.poi circle {
  cursor: pointer;
}

.poi text {
  pointer-events: none;
}
</style>
