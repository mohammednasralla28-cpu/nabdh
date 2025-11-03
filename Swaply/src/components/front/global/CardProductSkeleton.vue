<template>
  <div class="border
      rounded-[18px]
      h-[22rem]
      overflow-hidden
      bg-white
      dark:bg-gray-700
      dark:border-gray-700
      animate-pulse">
    <!-- Image Skeleton -->
    <div class="bg-gray-200 dark:bg-gray-600 w-full aspect-[4/3]"></div>

    <!-- Content Skeleton -->
    <div class="p-4">
      <!-- Title and Price -->
      <div class="flex items-center gap-4 mb-1">
        <div class="h-5 bg-gray-200 dark:bg-gray-600 rounded-lg flex-1"></div>
        <div class="h-5 bg-gray-200 dark:bg-gray-600 rounded-lg w-20"></div>
      </div>

      <!-- Description -->
      <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded-lg w-3/4 mb-1"></div>

      <!-- Store Name -->
      <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded-lg w-1/2 mb-1"></div>

      <!-- Time -->
      <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded-lg w-1/3"></div>
    </div>
  </div>
</template>

<script setup>
</script>

