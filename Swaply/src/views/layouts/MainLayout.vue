<!-- views/layouts/MainLayout.vue -->
<template>
  <app-layout>
    <template #title>
      <HeaderPage />
    </template>
    <template #buttons>
      <ButtonGroup />
    </template>
    <router-view />
  </app-layout>
</template>

<script setup>
import ButtonGroup from "../../components/front/global/ButtonGroup.vue";
import HeaderPage from "../../components/front/global/HeaderPage.vue";
import AppLayout from "../../components/front/global/layouts/AppLayout.vue";
</script>
