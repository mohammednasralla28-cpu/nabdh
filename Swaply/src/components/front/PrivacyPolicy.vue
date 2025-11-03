<script setup>
import SecondaryTitle from "./global/SecondaryTitle.vue";
import SingleFavoriteStructure from "./SingleFavoriteStructure.vue";
const data = [
  {
    title: "جمع المعلومات",
    text: "نحن نجمع المعلومات التي تقدمها لنا مباشرة, مثل عندما تقوم بانشاء حساب او الاتصال بنا. قد نجمع ايضا معلومات حول كيفية استخدامك للتطبيق.",
  },
  {
    title: "استخدام المعلومات",
    text: "نستخدم المعلومات التي نجمعها لتقديم وتحسين خدماتنا, وللتواصل معك ولحماية حقوقنا و حقوق المستخدمين الاخرين.",
  },
  {
    title: "مشاركة المعلومات",
    text: "لا نبيع او ناجر معلوماتك الشخصية لاطراف ثالثة. قد نشارك معلومات مجمعة و مجهولة الهوية لاغراض التحيل و التحسين.",
  },
];
</script>

<template>
  <SecondaryTitle label="سياسة الخصوصية" class="mb-3" />
  <div class="border rounded-xl p-6 pb-9 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
    <template v-for="item in data" :key="item.title">
      <SingleFavoriteStructure class="pb-0 border-none -mb-4" :title="item.title" :description="item.text" />
    </template>
  </div>
</template>
