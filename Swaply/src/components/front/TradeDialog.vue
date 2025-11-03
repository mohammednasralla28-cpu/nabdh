<!-- SwapOfferModal.vue -->
<template>
  <TransitionRoot :show="modelValue" as="template">
    <Dialog @close="closeDialog" class="relative z-50">
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

      <!-- Container -->
      <div class="fixed inset-0 flex items-center justify-center p-4 overflow-auto">
        <TransitionChild
          as="template"
          enter="ease-out duration-200"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95">
          <DialogPanel
            class="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg relative max-h-[90vh] overflow-auto shadow-lg">
          <!-- Close button -->
          <div class="absolute top-4 right-4">
            <span
              class="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white cursor-pointer transition-all"
              @click="closeDialog">
              <XMarkIcon class="w-5 h-5" />
            </span>
          </div>

          <!-- Title -->
          <DialogTitle class="pt-6 mb-4">
            <h3 class="font-medium text-lg text-black dark:text-white">
              {{ isEdit ? "تعديل عرض مقايضة" : "إضافة عرض مقايضة" }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300 text-sm mt-1">
              {{
                isEdit
                  ? "قم بتحديث تفاصيل العرض"
                  : "أضف تفاصيل عرض المقايضة الخاص بك"
              }}
            </p>
          </DialogTitle>

          <!-- Form Fields -->
          <div class="space-y-4">
            <FormControl id="offer_item" label="ماذا تعرض؟" placeholder="مثال: 5 لتر بنزين" v-model="data.offer_item"
              :error-message="errors.offer_item" />
            <FormControl id="request_item" label="ماذا تريد؟" placeholder="مثال: حليب اطفال" v-model="data.request_item"
              :error-message="errors.request_item" />
            <FormControl id="description" label="الوصف" placeholder="تفاصيل اضافية عن العرض" type="textarea"
              v-model="data.description" :error-message="errors.description" />
            <FormControl id="location" label="الموقع" placeholder="المنطقة او الحي" v-model="data.location"
              :error-message="errors.location" />

            <!-- Product Details -->
            <ProductDetailsForm v-model:quantity="data.quantity" v-model:contact_method="data.contact_method"
              v-model:availability="data.availability" v-model:exchange_preferences="data.exchange_preferences"
              v-model:offer_status="data.offer_status" />
            <!-- File input -->
            <div>
              <label for="file_image"
                class="flex items-center gap-2 cursor-pointer justify-center border border-gray-300 dark:border-gray-600 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all rounded-md">
                <CameraIcon class="w-4 h-4 text-gray-600 dark:text-gray-300" />
                <span class="dark:text-white">
                  {{ isEdit ? "تغيير الصورة" : "إضافة صورة" }}
                </span>
              </label>
              <input type="file" id="file_image" @change="uploadImage" hidden />
              <div v-if="data.image_url" class="mt-2">
                <img :src="data.image_url" alt="Preview"
                  class="w-auto mx-auto h-auto max-h-48 object-cover rounded-md" />
              </div>
            </div>

            <!-- Submit Button -->
            <MainButton :label="loading ? 'جاري الحفظ...' : isEdit ? 'تحديث العرض' : 'نشر العرض'
              " class="py-3" @click="submit" />
          </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import {
  reactive,
  ref,
  watch,
  inject,
  computed,
} from "vue";
import { XMarkIcon, CameraIcon } from "@heroicons/vue/24/outline";
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/vue";
import FormControl from "./global/FormControl.vue";
import MainButton from "./global/MainButton.vue";
import ProductDetailsForm from "./global/ProductDetailsForm.vue";
import axiosClient from "../../axiosClient";

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  editData: { type: Object, default: null },
});

const emit = defineEmits(["update:modelValue", "success"]);
const emitter = inject("emitter");

const isEdit = computed(() => {
  return props.editData?.offer_item ? true : false;
});

const data = reactive({
  offer_item: "",
  request_item: "",
  description: "",
  location: "",
  image: null,
  quantity: null,
  contact_method: null,
  availability: null,
  exchange_preferences: null,
  offer_status: null,
  image_url: null,
});

function sanitize(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "string" && value.trim().toLowerCase() === "undefined") {
    return "";
  }
  return value;
}

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal && props.editData) {
      Object.assign(data, {
        offer_item: sanitize(props.editData.offer_item),
        request_item: sanitize(props.editData.request_item),
        description: sanitize(props.editData.description),
        location: sanitize(props.editData.location),
        quantity: props.editData.quantity,
        contact_method: props.editData.contact_method,
        availability: props.editData.availability,
        exchange_preferences: props.editData.exchange_preferences,
        offer_status: props.editData.offer_status,
        image_url: props.editData.image || null,
        image: null,
      });
    } else if (!newVal) {
      resetForm();
    }
  }
);

function resetForm() {
  data.offer_item = "";
  data.request_item = "";
  data.description = "";
  data.location = "";
  data.quantity = null;
  data.contact_method = null;
  data.availability = null;
  data.exchange_preferences = null;
  data.offer_status = null;
  data.image = null;
  data.image_url = null;
}

function uploadImage(event) {
  const file = event.target.files[0];
  data.image = file;
  data.image_url = URL.createObjectURL(file);
}

function closeDialog() {
  emit("update:modelValue", false);
}

const loading = ref(false);

const errors = reactive({
  offer_item: "",
  request_item: "",
  description: "",
  location: "",
});

function validateRequired(value) {
  return value !== null && value !== undefined && String(value).trim() !== "" && String(value).trim() !== "null" && String(value).trim() !== "undefined" && String(value).trim().length > 0;
}

const submit = async () => {
  try {
    loading.value = true;
    // normalize values before validation
    data.offer_item = sanitize(data.offer_item);
    data.request_item = sanitize(data.request_item);
    data.description = sanitize(data.description);
    data.location = sanitize(data.location);
    // basic validation
    errors.offer_item = validateRequired(data.offer_item)
      ? ""
      : "هذا الحقل مطلوب";
    errors.request_item = validateRequired(data.request_item)
      ? ""
      : "هذا الحقل مطلوب";
    errors.description = validateRequired(data.description)
      ? ""
      : "هذا الحقل مطلوب";
    errors.location = validateRequired(data.location)
      ? ""
      : "هذا الحقل مطلوب";

    if (
      errors.offer_item ||
      errors.request_item ||
      errors.description ||
      errors.location
    ) {
      return;
    }
    const formData = new FormData();
    formData.append("offer_item", data.offer_item);
    formData.append("request_item", data.request_item);
    formData.append("description", data.description);
    formData.append("location", data.location);
    formData.append("quantity", data.quantity?.name || "");
    formData.append("contact_method", data.contact_method?.name || "");
    formData.append("availability", data.availability?.name || "");
    formData.append(
      "exchange_preferences",
      data.exchange_preferences?.name || ""
    );
    formData.append("offer_status", data.offer_status?.name || "");
    if (data.image) {
      formData.append("image", data.image);
    }

    let response;
    if (isEdit.value) {
      response = await axiosClient.post(
        `barters/${props.editData.id}?_method=PUT`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    } else {
      response = await axiosClient.post("barters", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    if (response.status === 200) {
      emitter.emit("showNotificationAlert", [
        "success",
        isEdit.value ? "تم تحديث العرض بنجاح!" : "تم نشر عرض المقايضة بنجاح!",
      ]);
      emit("success"); // Notify parent to refetch
      closeDialog();
    }
  } catch (e) {
  } finally {
    loading.value = false;
  }
};
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
