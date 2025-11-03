<script setup >
defineProps({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="p-4 rounded-lg bg-[#fefce8] border border-[#fab005]">
    <h5 class="title text-[#89530c] font-[500] mb-1">{{ title }}</h5>
    <p class="text text-[#89530c] text-[14px]">{{ text }}</p>
  </div>
</template>
