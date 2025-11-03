<script setup>
import { ref, computed, watch } from "vue";
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/vue";

// Props
const props = defineProps({
  modelValue: {
    type: Object,
    default: null,
  },
  items: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: "ابحث عن اي منتج... (خبز, ارز, حليب)",
  },
});

const emit = defineEmits(["update:modelValue", "search"]);

const selectedItem = ref(props.modelValue);

const query = ref("");

watch(
  () => props.modelValue,
  (val) => {
    selectedItem.value = val;
    query.value = val?.name || "";
  }
);

watch(selectedItem, (val) => {
  emit("update:modelValue", val);
  query.value = val?.name || "";
});

const filteredItems = computed(() => {
  if (!query.value) return props.items;
  return props.items.filter((item) =>
    item.name.toLowerCase().includes(query.value.toLowerCase())
  );
});


const searchFor = () => {
  emit("search", query.value);
};
</script>

<template>
  <Combobox v-model="selectedItem" @keyup.enter="searchFor" :by="(item) => item?.id ?? null">
    <div class="relative mt-1">
      <!-- Input -->
      <ComboboxInput @change="query = $event.target.value"
        class="focus:border-blue-400 py-3 bg-transparent text-gray-900 dark:text-white focus:ring-gray-500 rounded-md bg-gray-100 dark:bg-gray-700 block w-full placeholder:text-[14px] placeholder:font-normal dark:placeholder-gray-400"
        :placeholder="placeholder" v-model="query" :display-value="(item) => item?.name || query" />

      <!-- Options -->
      <ComboboxOptions
        class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md text-black bg-white dark:bg-gray-800 shadow-lg border-[1px] border-gray-400 combobox-scroll">
        <ComboboxOption v-for="item in filteredItems" :key="item.id" :value="item" v-slot="{ active, selected }">
          <li class="
              cursor-pointer
              py-2
              px-3
              transition
              bg-white
              dark:bg-gray-800
              text-gray-900
              dark:text-gray-200
              data-[active=true]:bg-blue-500
              data-[active=true]:dark:bg-blue-600
              data-[active=true]:text-white
              data-[selected=true]:bg-gray-200
              data-[selected=true]:dark:bg-blue-700/40
              data-[selected=true]:text-gray-700
              data-[selected=true]:dark:text-gray-100
            " :data-active="active" :data-selected="selected">
            {{ item.name }}
          </li>
        </ComboboxOption>
      </ComboboxOptions>
    </div>
  </Combobox>
</template>



<style scoped>
.combobox-scroll::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.combobox-scroll::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 6px;
}

.combobox-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(100, 100, 100, 0.5);
  border-radius: 6px;
  border: 2px solid transparent;
  background-clip: content-box;
}

.combobox-scroll::-webkit-scrollbar-thumb:hover {
  background-color: rgba(100, 100, 100, 0.7);
}

.combobox-scroll::-webkit-scrollbar-corner {
  background: transparent;
}
</style>
