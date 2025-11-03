<script setup>
defineProps({
  data: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div>
    <span class="column-title text-gray-900 dark:text-gray-200 font-medium block mb-4">
      {{ data.groupTitle }}
    </span>
    <ul>
      <li v-for="item in data.items" :key="item"
        class="text-gray-600 mx-auto sm:mx-0 dark:text-gray-400 block my-[6px] relative w-fit cursor-pointer font-normal text-[14px] transition-colors hover:text-blue-700 dark:hover:text-blue-400">
        {{ item.text }}
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
ul {
  li {
    &::after {
      content: "";
      position: absolute;
      background-color: currentColor;
      bottom: -3px;
      width: 0%;
      transition: 0.3s;
      height: 2px;
      left: 50%;
      transform: translateX(-50%);
    }

    &:hover::after {
      width: 100%;
    }
  }
}
</style>