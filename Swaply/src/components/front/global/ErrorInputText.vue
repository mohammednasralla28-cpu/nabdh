<script setup>
defineProps({
  errorMessage: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <small class="text-red-600 font-normal opacity" dir="rtl" v-if="errorMessage">{{
    errorMessage
  }}</small>
</template>