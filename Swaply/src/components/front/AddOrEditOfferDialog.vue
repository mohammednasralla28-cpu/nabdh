<template>
  <TransitionRoot :show="modelValue" as="template">
    <Dialog @close="closeDialog" class="relative z-[1000000000]" v-if="product.id">
      <!-- Overlay with transition -->
      <TransitionChild
        as="template"
        enter="ease-out duration-200"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/30" aria-hidden="true" />
      </TransitionChild>
      
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <TransitionChild
          as="template"
          enter="ease-out duration-200"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95">
          <DialogPanel
            class="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg max-h-[90vh] overflow-y-auto relative">
          <DialogTitle class="pt-6 mb-3">
            <h3 class="title font-medium text-[20px] text-black dark:text-white">
              {{ isEditPage ? "تعديل العرض" : "اضافة عرض" }}
            </h3>
            <p class="subtitle font-normal text-gray-600 mt-1 text-[14px] dark:text-gray-300">
              {{
                isEditPage ? "تعديل تفاصيل العرض للمنتج" : "اضف عرض جديد لمنتجك"
              }}
              <span class="underline font-medium">{{ product.name }}</span>
            </p>
          </DialogTitle>
          <form @submit.prevent="submit">
            <div class="mb-4">
              <label class="block mb-1 font-normal text-black dark:text-white">نوع الخصم</label>
              <select v-model="discountType"
                class="block w-full rounded-md placeholder:text-[14px] placeholder:font-normal pr-8" :class="{
                  'border-red-600 focus:border-red-500 dark:text-white focus:ring-red-600 bg-red-100/70 placeholder:text-red-500':
                    errors.discount_type,
                  'focus:border-gray-500 dark:text-white focus:ring-gray-500  bg-gray-100 dark:bg-gray-700 dark:placeholder-gray-400':
                    !errors.discount_type,
                }">
                <option v-for="option in discountOptions" :key="option.id" :value="option.id" class="text-sm text-gray-700 dark:text-white
                  ">
                  {{ option.name }}
                </option>
              </select>
              <ErrorInputText :error-message="errors.discount_type" />
            </div>
            <FormControl id="discount" :label="discountType === 'fixed' ? 'الخصم بالمبلغ' : 'الخصم بالنسبة'
              " type="number" v-model="discount_value" :error-message="errors.discount_value" placeholder="0"
              class="pr-6">
              <template #suffix>
                {{ suffixSymbol }}
              </template>
            </FormControl>
            <div>
              <span class="font-normal  text-black dark:text-white">الحالة:</span>
              <div class="flex justify-evenly items-center">
                <div class="flex gap-1 items-center text-gray-700">
                  <input id="active" type="radio" v-model="is_active" :value="true" name="status" />
                  <label for="active" class="text-black dark:text-white">نشط</label>
                </div>
                <div class="flex gap-1 items-center text-gray-700">
                  <input id="in-active" type="radio" v-model="is_active" :value="false" name="status" />
                  <label for="in-active" class="text-black dark:text-white">غير نشط</label>
                </div>
              </div>
            </div>

            <FormControl id="start_date" label="تاريخ البداية" type="date" v-model="startDate"
              :error-message="errors.start_date" />
            <FormControl id="end_date" label="تاريخ النهاية" type="date" v-model="endDate"
              :error-message="errors.end_date" />

            <MainButton :label="isEditPage ? 'تعديل العرض' : 'اضافة العرض'" class="bg-gray-800 mt-4" type="submit" />

            <div class="absolute top-[20px] right-[20px]">
              <XMarkIcon class="h-5 w-5 cursor-pointer stroke-[4px] dark:stroke-white" style="stroke-width: 3px;"
                @click="closeDialog()" />
            </div>
          </form>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
<script setup>
import { computed, inject, ref, watch } from "vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import axiosClient from "../../axiosClient";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/vue";

import FormControl from "./global/FormControl.vue";
import ErrorInputText from "./global/ErrorInputText.vue";
import MainButton from "./global/MainButton.vue";

const props = defineProps({
  modelValue: Boolean,
  product: { type: Object, default: () => ({}) },
});
const emit = defineEmits(["update:modelValue", "fetch-products"]);
const emitter = inject("emitter");
const is_active = ref(true);
// validation schema
const schema = yup.object({
  discount_type: yup.string().required(),
  discount_value: yup
    .number()
    .nullable()
    .when("discount_type", {
      is: "fixed",
      then: (schema) =>
        schema.min(0, "يجب ان يكون رقم >= 0").required("المبلغ مطلوب"),
    })
    .when("discount_type", {
      is: "percent",
      then: (schema) =>
        schema
          .min(1, "أقل نسبة 1%")
          .max(100, "اقصى نسبة 100%")
          .required("النسبة مطلوبة"),
    }),
  start_date: yup.date().required("تاريخ البداية مطلوب"),
  end_date: yup
    .date()
    .required("تاريخ النهاية مطلوب")
    .min(yup.ref("start_date"), "يجب أن يكون بعد تاريخ البداية"),
});

const { handleSubmit, defineField, errors, resetForm } = useForm({
  validationSchema: schema,
});

const [discountType] = defineField("discount_type"); // fixed | percent
const [discount_value] = defineField("discount_value");
const [startDate] = defineField("start_date");
const [endDate] = defineField("end_date");

const resetInputsForm = () => {
  resetForm({
    values: {
      startDate: "",
      endDate: "",
      discountType: "fixed",
      discountPercent: null,
    },
  });
};

discountType.value = "fixed";

const discountOptions = [
  { id: "fixed", name: "خصم ثابت" },
  { id: "percent", name: "خصم نسبة مئوية" },
];

const suffixSymbol = computed(() =>
  discountType.value === "fixed" ? "₪" : "%"
);
const isEditPage = computed(() => {
  return props.product.active_offer || props.product.offer;
});

const closeDialog = () => {
  emit("update:modelValue", false);
};

// submit
const submit = handleSubmit(async (values) => {
  const payload = {
    product_id: props.product.id,
    start_date: values.start_date,
    end_date: values.end_date,
    active: is_active.value ? 1 : 0,
  };

  if (discountType.value == "fixed") {
    payload.discount_price = discount_value.value;
  } else {
    payload.discount_percent = discount_value.value;
  }

  try {
    if (isEditPage.value) {
      const offerId = props.product.active_offer?.id || props.product.offer?.id;
      const response = await axiosClient.put(
        `merchant/offers/${offerId}`,
        payload
      );
      if (response.status === 200) {
        emitter.emit("showNotificationAlert", [
          "success",
          "تم تعديل العرض بنجاح!",
        ]);
        // Emit event to update other sections in real-time
        emitter.emit("offerUpdated", {
          productId: props.product.id,
          offerId: offerId,
          offerData: response.data.offer
        });
        emit("fetch-products");
        closeDialog();
      }
      return;
    }
    const response = await axiosClient.post("merchant/offers", payload);
    if (response.status === 201) {
      emitter.emit("showNotificationAlert", [
        "success",
        "تم اضافة العرض بنجاح!",
      ]);
      // Emit event to update other sections in real-time
      emitter.emit("offerAdded", {
        productId: props.product.id,
        offerId: response.data.offer.id,
        offerData: response.data.offer
      });
      emit("fetch-products");
      closeDialog();
    }
  } catch (e) {
    emitter.emit("showNotificationAlert", [
      "error",
      "حدث خطأ أثناء حفظ العرض. حاول مرة أخرى.",
    ]);
  }
});
const formatDate = (datetime) => datetime?.split(" ")[0] ?? "";
watch(
  () => props.product.active_offer || props.product.offer,
  (newVal) => {
    if (newVal) {
      const offer = newVal;
      startDate.value = formatDate(offer.start_date);
      endDate.value = formatDate(offer.end_date);
      is_active.value = Boolean(offer.active);

      if (offer.discount_price) {
        discountType.value = "fixed";
        discount_value.value = +offer.discount_price;
      } else if (offer.discount_percent) {
        discountType.value = "percent";
        discount_value.value = +offer.discount_percent;
      }
    }
  },
  { immediate: true }
);
</script>
<style scoped>
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(100, 100, 100, 0.5);
  border-radius: 3px;
}
</style>
