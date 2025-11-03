<script setup>
import { ref } from "vue";
import ShowMoreButton from "../ShowMoreButton.vue";

const buttonLabel = ref("عرض الكل");

const showAll = ref(false);

const emit = defineEmits(["showAll"]);
const showAllProduct = () => {
  if (showAll.value) {
    buttonLabel.value = "عرض الكل";
    showAll.value = false;
    emit("showAll", false);
    return;
  }
  showAll.value = true;
  buttonLabel.value = "عرض أقل";
  emit("showAll", true);
};
</script>

<template>
  <ShowMoreButton @click="showAllProduct()" :label="buttonLabel" />
</template>