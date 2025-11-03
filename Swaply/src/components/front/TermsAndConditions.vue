<script setup>
import SecondaryTitle from "./global/SecondaryTitle.vue";
import SingleFavoriteStructure from "./SingleFavoriteStructure.vue";
const data = [
  {
    title: "قبول الشروط",
    text: "باستخدام هذا التطبيق, فالك توافق على الالتزام بهذه الشروط و الاحكام. اذا كنت لا توافق على اي من هذه الشروط, يرجى عدم استخدام التطبيق",
  },
  {
    title: "استخدام الخدمة",
    text: "يجب عليك استخدام التطبيق بطريقة قانونية ومسؤولة. لا يجوز لك استخدام التطبيق لاي اغراض غير قانونية او محضورة.",
  },
  {
    title: "المسؤولية",
    text: "نحن نبذل قصارى جهدنا لضمان دقة المعلومات المقدمة, لكننا لا نضمن صحة جميع البيانات المدخلة من قبل المستخدمين.",
  },
];
</script>

<template>
  <SecondaryTitle label="الشروط و الاحكام" class="mb-3" />
  <div class="border rounded-xl p-6 pb-9 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
    <template v-for="item in data" :key="item.title">
      <SingleFavoriteStructure class="pb-0 border-none -mb-4" :title="item.title" :description="item.text" />
    </template>
  </div>
</template>