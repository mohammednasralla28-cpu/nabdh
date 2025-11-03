<template>
  <div>
    <EasyDataTable ref="dataTable" :headers="headers" :items="items" :pagination="true" :search="true" :sortable="true"
      :rows-per-page="rowsPerPage" :hide-footer="true" table-class-name="customize-table"
      :class="currentTheme === 'dark' ? 'dark-theme' : ''" header-text-direction="center" body-text-direction="center"
      class="rounded-lg overflow-hidden">
      <template #item-image="item">
        <slot name="image" :item="item" />
      </template>

      <!-- actions slot -->
      <template #item-actions="item">
        <slot name="actions" :item="item" />
      </template>

      <!-- empty message slot -->
      <template #empty-message>
        <div class="text-center text-gray-500 dark:text-gray-300 py-4 ">لا توجد بيانات لعرضها</div>
      </template>
    </EasyDataTable>
    <!-- Footer -->
    <div class="customize-footer">
      <div class="flex justify-between items-center dark:bg-gray-800 p-3 rounded">
        <!-- Rows per page -->
        <div>
          <label
          for="rows-per-page"
           class="font-normal text-[14px] text-gray-700 dark:text-gray-300 ml-3">
            عدد الصفوف لكل صفحة:
          </label>
          <select
          id="rows-per-page"
           v-model="rowsPerPage" @change="updateRowsPerPageSelect"
            class="appearance-none border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 pr-8 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option v-for="n in [5, 10, 15, 20]" :key="n" :value="n">
              {{ n }}
            </option>
          </select>
        </div>

        <!-- Display items -->
        <div class="text-[12px] text-gray-700 dark:text-gray-300">
          عرض: {{ currentPageFirstIndex }} ~ {{ currentPageLastIndex }} من
          {{ items.length }}
        </div>

        <!-- Pagination -->
        <div class="flex gap-2 items-center">
          <button @click="prevPage" :disabled="isFirstPage" class="px-2 py-1 transition-all duration-200" :class="{
            'text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300':
              !isFirstPage,
            'text-gray-400 dark:text-gray-500': isFirstPage,
          }">
            <slot name="prev-icon" />
          </button>

          <span v-for="page in maxPaginationNumber" :key="page" @click="updatePage(page)" :class="{
            'bg-blue-600 dark:bg-blue-700 text-white px-2 py-1 rounded cursor-pointer':
              page === currentPaginationNumber,
            'px-2 py-1 rounded cursor-pointer text-gray-700 dark:text-gray-300':
              page !== currentPaginationNumber,
          }">
            {{ page }}
          </span>

          <button @click="nextPage" :disabled="isLastPage" class="px-2 py-1 transition-all duration-200" :class="{
            'text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300':
              !isLastPage,
            'text-gray-400 dark:text-gray-500': isLastPage,
          }">
            <slot name="next-icon" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";
import { useThemeStore } from "../../../stores/theme";
import { storeToRefs } from "pinia";
import { useRowsPerPage } from "use-vue3-easy-data-table";

const dataTable = ref();
const {
  updateRowsPerPageActiveOption,
} = useRowsPerPage(dataTable);
const props = defineProps({
  headers: { type: Array, required: true },
  items: { type: Array, required: true },
});

const themeStore = useThemeStore();
const { currentTheme } = storeToRefs(themeStore);

const rowsPerPage = ref(10);

// Pagination computed
const currentPageFirstIndex = computed(
  () => dataTable.value?.currentPageFirstIndex || 0
);
const currentPageLastIndex = computed(
  () => dataTable.value?.currentPageLastIndex || 0
);
const maxPaginationNumber = computed(
  () => dataTable.value?.maxPaginationNumber || 1
);
const currentPaginationNumber = computed(
  () => dataTable.value?.currentPaginationNumber || 1
);
const isFirstPage = computed(() => dataTable.value?.isFirstPage || false);
const isLastPage = computed(() => dataTable.value?.isLastPage || false);

const nextPage = () => dataTable.value?.nextPage();
const prevPage = () => dataTable.value?.prevPage();
const updatePage = (n) => dataTable.value?.updatePage(n);
const updateRowsPerPageSelect = (e) => {
  updateRowsPerPageActiveOption(Number(e.target.value));
};
</script>

<style scoped lang="scss">
.customize-table {
  /* Table border */
  --easy-table-border: 1px solid #e2e8f0;
  --easy-table-row-border: 1px solid #dde4eb;

  /* Header */
  --easy-table-header-font-size: 15px;
  --easy-table-header-height: 52px;
  --easy-table-header-font-color: #ffffff;
  --easy-table-header-background-color: #3b82f6;
  --easy-table-header-background-color-dark: #1e40af;
  --easy-table-header-item-padding: 12px 16px;

  /* Body rows */
  --easy-table-body-row-font-size: 14px;
  --easy-table-body-row-height: 50px;
  --easy-table-body-row-font-color: #374151;
  --easy-table-body-row-background-color: #ffffff;
  --easy-table-body-even-row-background-color: #f9fafb;
  --easy-table-body-row-hover-background-color: #f3f4f6;
  --easy-table-body-row-hover-font-color: #111827;
  --easy-table-body-item-padding: 12px 16px;

  /* Footer */
  --easy-table-footer-background-color: #f3f4f6;
  --easy-table-footer-font-color: #374151;
  --easy-table-footer-font-size: 14px;
  --easy-table-footer-padding: 0px 12px;
  --easy-table-footer-height: 50px;

  /* Scrollbar */
  --easy-table-scrollbar-track-color: #f3f4f6;
  --easy-table-scrollbar-color: #d1d5db;
  --easy-table-scrollbar-thumb-color: #9ca3af;
  --easy-table-scrollbar-corner-color: #f3f4f6;

  /* Loading mask */
  --easy-table-loading-mask-background-color: rgba(255, 255, 255, 0.8);

  /* Rounded corners */
  border-radius: 0.5rem;
}

/* Dark Mode support */
.dark-theme {
  --easy-table-header-background-color: #1e40af;
  --easy-table-body-row-background-color: #1f2937;
  --easy-table-body-even-row-background-color: #374151;
  --easy-table-body-row-font-color: #f9fafb;
  --easy-table-body-row-hover-background-color: #e6e6e630;
  --easy-table-body-row-hover-font-color: #ffffff;
  --easy-table-footer-background-color: #1f2937;
  --easy-table-footer-font-color: #f9fafb;
  --easy-table-border: 1px solid #374151;
  --easy-table-row-border: 1px solid #4b5563;
}
</style>
