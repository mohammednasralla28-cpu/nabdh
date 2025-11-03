<script setup>
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";
import NotificationSectionTitle from "./NotificationSectionTitle.vue";
import { computed, onMounted, reactive, ref } from "vue";
import MainButton from "./global/MainButton.vue";
import { ChevronDownIcon, ChevronUpIcon, PlusIcon } from "@heroicons/vue/24/solid";
import { useProductStore } from "../../stores/product";
import { storeToRefs } from "pinia";
import { useNotificationStore } from "../../stores/notification";

const productStore = useProductStore();
const { products } = storeToRefs(productStore);
const notificationStore = useNotificationStore();
const { loading, status } = storeToRefs(notificationStore);

const notification = reactive({
  price: "",
  selected: { id: 2, name: "أقل من", value: "lt" },
});

const options = [
  { id: 1, name: "أكبر من", value: "gt" },
  { id: 2, name: "أقل من", value: "lt" },
];

const selectedItem = ref(null);
const query = ref("");

const filteredItems = computed(() =>
  query.value === ""
    ? products.value
    : products.value.filter((item) =>
      item.name.toLowerCase().includes(query.value.toLowerCase())
    )
);
const addNotification = async () => {
  await notificationStore.addNotification(
    selectedItem.value.id,
    notification.selected.value,
    notification.price
  );

  if ((status.value = 201)) {
    query.value = "";
    selectedItem.value = "";
    notification.price = "";
    notification.selected = { id: 2, name: "أقل من", value: "lt" };
    status.value = 400;
  }
};

onMounted(async () => {
  await productStore.fetchAllProductsIds();
});
</script>

<template>
  <div
    class="px-6 pt-8 pb-6 rounded-[20px] shadow-md dark:shadow-[inset_0_4px_10px_rgba(0,0,0,0.01)] dark:shadow-slate-700 bg-white dark:bg-gray-900 mt-6">
    <NotificationSectionTitle title="اضافة تنبيه جديد" />

    <div class="combobox mt-6">
      <Combobox v-model="selectedItem">
        <div class="relative mt-1">
          <!-- input -->
          <ComboboxInput
            class="focus:border-gray-500 border-none py-3 text-gray-900 dark:text-white focus:ring-gray-500 rounded-md bg-gray-100 dark:bg-gray-700 block w-full placeholder:text-[14px] placeholder:font-normal dark:placeholder-gray-400"
            @change="query = $event.target.value" placeholder="اسم المنتج (مثل: بيض, رز, حليب)"
            :displayValue="(item) => item?.name" />
          <ComboboxOptions
            class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 shadow-lg">
            <ComboboxOption v-for="item in filteredItems" :key="item.id" :value="item" v-slot="{ active, selected }">
              <li class="cursor-pointer select-none py-2 px-3" :class="[
                active
                  ? 'bg-gray-500 dark:bg-gray-600 text-white'
                  : 'text-gray-900 dark:text-gray-200',
                selected ? 'bg-gray-200 dark:bg-blue-700 text-gray-600' : '',
              ]">
                {{ item.name }}
              </li>
            </ComboboxOption>
          </ComboboxOptions>
        </div>
      </Combobox>
    </div>

    <div class="flex my-4 gap-4">
      <Listbox v-model="notification.selected">
        <div class="relative w-60">
          <ListboxButton v-slot="{ open }"
            class="w-full flex items-center justify-between rounded-md bg-gray-100 dark:bg-gray-700 py-3 px-3 text-gray-900 dark:text-white">
            <span>{{ notification.selected.name }}</span>
            <ChevronUpIcon class="w-5 h-5 text-gray-500 mt-2" v-if="open" />
            <ChevronDownIcon class="w-5 h-5 text-gray-500 mt-2" v-else />
          </ListboxButton>
          <ListboxOptions
            class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 shadow-lg">
            <ListboxOption v-for="option in options" :key="option.id" :value="option" v-slot="{ active, selected }">
              <li class="cursor-pointer select-none py-2 px-3" :class="[
                active
                  ? 'bg-gray-500 dark:bg-gray-600 text-white'
                  : 'text-gray-900 dark:text-gray-200',
                selected ? 'bg-gray-200 dark:bg-blue-700 text-gray-600' : '',
              ]">
                {{ option.name }}
              </li>
            </ListboxOption>
          </ListboxOptions>
        </div>
      </Listbox>

      <div class="relative w-full">
        <span
          class="absolute inset-y-0 right-4 flex items-center pl-3 -mt-1 text-gray-500 dark:text-gray-300 text-[24px] font-normal"
          :class="notification.price
            ? 'text-gray-900 dark:text-white'
            : 'text-gray-500 dark:text-gray-400'
            ">
          ₪
        </span>
        <input type="number" min="0" v-model="notification.price"
          @input="e => { if (e.target.value < 0) e.target.value = 0; notification.price = e.target.value }"
          class="no-spinner focus:border-gray-500 border-none py-3 pl-8 pr-9 flex-1 text-gray-900 dark:text-white focus:ring-gray-500 rounded-md bg-gray-100 dark:bg-gray-700 block w-full placeholder:text-[14px] placeholder:font-normal dark:placeholder-gray-400"
          placeholder="0" />

      </div>
    </div>

    <MainButton label="اضافة تنبيه" @click="addNotification()" :class="{ 'pointer-events-none': loading }">
      <template #icon>
        <PlusIcon class="w-6 h-6" />
      </template>
    </MainButton>
  </div>
</template>