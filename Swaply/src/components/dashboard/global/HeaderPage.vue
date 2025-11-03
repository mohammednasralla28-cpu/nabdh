<script setup>
import ButtonAdd from "./ButtonAdd.vue";
import PageTitle from "./PageTitle.vue";

defineProps({
  title: {
    type: String,
    required: true,
  },
  ButtonLabel: {
    type: String,
  },
  isHasAddButton: {
    type: Boolean,
    default: true,
  },
});
</script>

<template>
  <div class="flex justify-between items-center pt-6 mb-3">
    <PageTitle :title="title" />
    <ButtonAdd :label="ButtonLabel" v-if="isHasAddButton" @click="$emit('buttonAddClick')" />
  </div>
</template>