<script setup>
import { computed, ref, watch } from "vue";
import MainButton from "../../components/front/global/MainButton.vue";
import { mdiGoogle } from "@mdi/js";
import MdiIcon from "../../components/front/MdiIcon.vue";
import ButtonTab from "../../components/front/ButtonTab.vue";
import { useRouter } from "vue-router";
import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/outline";
import { VueSpinnerIos } from "vue3-spinners";
import BackButton from "../../components/front/global/BackButton.vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import ErrorInputText from "../../components/front/global/ErrorInputText.vue";
import { useAuthStore } from "../../stores/auth/auth";
import { storeToRefs } from "pinia";

const authStore = useAuthStore();
const { loading, backErrors } = storeToRefs(authStore);
const showPassword = ref(false);
const type = ref("text");
const placeholderInput = ref("0 59 123 4567");
const buttonTitle = ref("مرحبا بعودتك");
const router = useRouter();
const isLoginPage = ref(false);
const isPhoneNumber = ref(true);
const using = ref("phone_number");

const baseSchema = {
  emailOrPhone: yup
    .string()
    .required("هذا الحقل مطلوب")
    .test("emailOrPhone", function (value) {
      if (!value) return false;

      const phoneRegex = /^[0-9]{10}$/;

      const isPhone = isPhoneNumber.value;
      const isValid = isPhone
        ? phoneRegex.test(value)
        : yup.string().email().isValidSync(value);

      if (!isValid) {
        return this.createError({
          message: isPhone ? "أدخل رقم هاتف صحيح" : "ادخل بريد إلكتروني صحيح",
        });
      }

      return true;
    }),

  password: yup
    .string()
    .required("كلمة المرور مطلوبة")
    .min(6, "كلمة المرور يجب أن تكون 6 خانات على الأقل"),
};
const schema = computed(() => {
  if (isLoginPage.value) {
    return yup.object(baseSchema);
  } else {
    return yup.object({
      ...baseSchema,
      first_name: yup.string().required("الاسم الأول مطلوب"),
      last_name: yup.string().required("الاسم الأخير مطلوب"),
    });
  }
});
const { handleSubmit, errors, defineField, resetForm } = useForm({
  validationSchema: schema,
  context: { type: type.value },
});


const [emailOrPhone] = defineField("emailOrPhone");
const [password] = defineField("password");
const [first_name] = defineField("first_name");
const [last_name] = defineField("last_name");

// Delayed error display
const displayedErrors = ref({});
const errorTimeouts = {};

watch(
  errors,
  (newErrors) => {
    // Clear existing timeouts
    Object.keys(errorTimeouts).forEach((key) => {
      if (errorTimeouts[key]) {
        clearTimeout(errorTimeouts[key]);
      }
    });

    // Set new timeouts for each field
    Object.keys(newErrors).forEach((field) => {
      if (newErrors[field]) {
        errorTimeouts[field] = setTimeout(() => {
          displayedErrors.value = { ...displayedErrors.value, [field]: newErrors[field] };
        }, 800); // 500ms delay
      } else {
        // Clear error immediately if validation passes
        displayedErrors.value = { ...displayedErrors.value, [field]: null };
      }
    });

    // Clear errors for fields that are no longer in newErrors
    Object.keys(displayedErrors.value).forEach((field) => {
      if (!(field in newErrors)) {
        displayedErrors.value = { ...displayedErrors.value, [field]: null };
      }
    });
  },
  { deep: true }
);

watch(
  isPhoneNumber,
  (newVal) => {
    if (newVal) {
      placeholderInput.value = "0 59 123 4567";
      using.value = "phone_number";
      type.value = "text";
      emailOrPhone.value = "";
    } else {
      placeholderInput.value = "example@gmail.com";
      using.value = "email";
      type.value = "email";
      emailOrPhone.value = "";
    }
    resetForm({
      values: {
        emailOrPhone: "",
        password: "",
        first_name: first_name.value,
        last_name: last_name.value,
      },
      errors: {},
    });

    router.replace({
      name: router.currentRoute.value.name,
      query: { using: using.value },
    });
  },
  {
    immediate: true,
  }
);
watch(
  () => router.currentRoute.value.name,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      resetForm({
        values: {
          emailOrPhone: "",
          password: "",
          first_name: "",
          last_name: "",
        },
        errors: {},
      });
    }
    if (newVal == "login") {
      isLoginPage.value = true;
      buttonTitle.value = "مرحبا بعودتك";
      return;
    }
    isLoginPage.value = false;
    buttonTitle.value = "انضمام";
  },
  {
    immediate: true,
  }
);

const onSubmit = handleSubmit(async () => {

  const routeName = router.currentRoute.value.name;
  const credentials = {
    password: password.value,
  };
  if (isPhoneNumber.value) {
    credentials.phone = "+97" + emailOrPhone.value;
  } else {
    credentials.email = emailOrPhone.value;
  }
  if (routeName == "login") {
    await authStore.login(credentials);
  }
  if (routeName == "register") {
    credentials.name = `${first_name.value} ${last_name.value}`;
    await authStore.register(credentials);
  }

});

const firstError = (field) => {
  return Array.isArray(backErrors.value?.[field])
    ? backErrors.value[field][0]
    : null;
};

const continueWithGoogle = () => {
  // Use environment variable or axiosClient
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';
window.location.href = `${baseURL}/auth/google`;
};

</script>

<template>
  <div class="bg-gray-100 dark:bg-gray-800 min-h-screen">
    <div class="logo flex items-center justify-center pt-6">
      <img src="/Logo.png" class="w-32 dark:hidden" alt="logo" />
      <img src="/Logo-black.png" class="w-32 hidden dark:block" alt="logo" />
    </div>
    <div class="container mx-auto p-2 sm:p-0 mt-9 h-screen flex items-start justify-center">
      <form @submit.prevent="onSubmit"
        class="bg-white dark:bg-gray-900 rounded-[22px] border border-gray-300 dark:border-gray-700 p-6 w-full sm:w-[420px]">
        <!-- التبديل بين تسجيل الدخول والتسجيل -->
        <div
          class="buttons bg-gray-200 dark:bg-gray-700 p-[2px] rounded-full text-[16px] flex items-center gap-0.5 mb-4">
          <ButtonTab label="تسجيل الدخول" :is-active="isLoginPage"
            @click="router.push({ name: 'login', query: { using } })" class="py-2 rounded-full" />
          <ButtonTab label="انضم مجانا" :is-active="!isLoginPage"
            @click="router.push({ name: 'register', query: { using } })" class="py-2 rounded-full" />
        </div>

        <!-- الاسم الأول والاخير -->
        <div class="flex items-start justify-between gap-4 mb-4" v-if="!isLoginPage">
          <div class="relative">
            <input type="text" id="nameinput" pattern="[\u0600-\u06FF\s]*" title="الرجاء إدخال أحرف عربية فقط"
              placeholder="الاسم الاول" v-model="first_name"
              class="block w-full rounded-md placeholder:text-[14px] placeholder:font-normal" :class="{
                'border-red-600 focus:border-red-500 dark:text-white focus:ring-red-600 bg-red-100/10 transition duration-300 placeholder:text-red-500':
                  displayedErrors.first_name,
                'focus:border-gray-500 border-none dark:text-white focus:ring-gray-500  bg-gray-100 dark:bg-gray-700 dark:placeholder-gray-400':
                  !displayedErrors.first_name,
              }" />
            <ErrorInputText :error-message="displayedErrors?.first_name" />
          </div>
          <div class="relative">
            <input type="text" id="nameinput2" pattern="[\u0600-\u06FF\s]*" title="الرجاء إدخال أحرف عربية فقط"
              placeholder="الاسم الاخير" v-model="last_name"
              class="block w-full rounded-md placeholder:text-[14px] placeholder:font-normal" :class="{
                'border-red-600 focus:border-red-500 dark:text-white focus:ring-red-600  bg-red-100/10 transition duration-300 placeholder:text-red-500':
                  displayedErrors.last_name,
                'focus:border-gray-500 border-none dark:text-white focus:ring-gray-500  bg-gray-100 dark:bg-gray-700 dark:placeholder-gray-400':
                  !displayedErrors.last_name,
              }" />
            <ErrorInputText :error-message="displayedErrors.last_name" />
          </div>
        </div>

        <!-- التبديل بين الايميل والهاتف -->
        <div
          class="buttons bg-gray-200 dark:bg-gray-700 p-[2px] rounded-full text-[13px] flex items-center gap-0.5 mb-4">
          <ButtonTab label="البريد الالكتروني" :is-active="!isPhoneNumber" @click="isPhoneNumber = false"
            class="py-1 rounded-full" />
          <ButtonTab label="الهاتف" :is-active="isPhoneNumber" @click="isPhoneNumber = true"
            class="py-1 rounded-full" />
        </div>

        <!-- الايميل أو الهاتف -->
        <div class="relative" dir="ltr">
          <div class="relative">
            <input id="emailOrPhoneInput" :type="type" :placeholder="placeholderInput" v-model="emailOrPhone"
              class="no-spinner focus:border-gray-500 focus:ring-gray-500 rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white block w-full placeholder:text-[14px] placeholder:font-normal dark:placeholder-gray-400"
              :class="{
                'pl-[35px]': type === 'text',
                'pl-[39px]': emailOrPhone !== '' && type === 'text',
                'border-red-600 text-red-600  focus:border-red-500 dark:text-white focus:ring-red-600 bg-red-100/70 placeholder:text-red-500':
                  displayedErrors.emailOrPhone ||
                  firstError('email') ||
                  firstError('phone'),
                'focus:border-gray-500 border-none  dark:text-white focus:ring-gray-500  bg-gray-100 dark:bg-gray-700 dark:placeholder-gray-400':
                  !displayedErrors.emailOrPhone &&
                  !firstError('email') &&
                  !firstError('phone'),
              }" />
            <span v-if="type == 'text'" class="absolute left-3 top-1/2 -translate-y-1/2" :class="{
              'text-red-500':
                displayedErrors.emailOrPhone ||
                firstError('email') ||
                firstError('phone'),
              'mt-[1px] text-[14px] dark:text-gray-400 font-normal text-gray-500':
                emailOrPhone === '',
              'text-black dark:text-white':
                emailOrPhone !== '' &&
                !firstError('email') &&
                !firstError('phone'),
            }">+97</span>
          </div>
          <ErrorInputText :error-message="displayedErrors.emailOrPhone || firstError('email') || firstError('phone')
            " />
        </div>

        <!-- كلمة المرور -->
        <div class="relative">
          <div class="relative w-full mt-3">
            <input id="passwordInput" :type="showPassword ? 'text' : 'password'" v-model="password"
              placeholder="كلمة المرور"
              class="focus:border-gray-500 focus:ring-gray-500 rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white block w-full placeholder:text-[14px] placeholder:font-normal dark:placeholder-gray-400 pl-10"
              :class="{
                'border-red-600 focus:border-red-500 dark:text-white focus:ring-red-600 bg-red-100/70 placeholder:text-red-500':
                  displayedErrors.password,
                'focus:border-gray-500 border-none dark:text-white focus:ring-gray-500  bg-gray-100 dark:bg-gray-700 dark:placeholder-gray-400':
                  !displayedErrors.password,
              }" />

            <button type="button" @click="showPassword = !showPassword"
              class="absolute inset-y-0 left-2 flex items-center px-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              :class="{
                'text-red-500 hover:text-red-600': displayedErrors.password,
              }">
              <component :is="showPassword ? EyeIcon : EyeSlashIcon" class="w-5 h-5" />
            </button>
          </div>
          <ErrorInputText :error-message="displayedErrors.password" />
        </div>

        <!-- نسيت كلمة السر -->
        <span v-if="isLoginPage" @click="router.push({ name: 'forgot-password' })"
          class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-500 transition-colors cursor-pointer text-[12px] mt-[6px] block">هل
          نسيت كلمة السر؟</span>

        <!-- زر تسجيل الدخول -->
        <MainButton type="submit" :label="buttonTitle" class="mt-6 select-none" :style="{ opacity: loading ? 0.8 : 1 }"
          :class="{ 'pointer-events-none': loading }">
          <template #icon>
            <VueSpinnerIos v-if="loading" size="20" class="text-gray-50 ml-2" />
          </template>
        </MainButton>

        <!-- أو -->
        <div class="relative mt-4">
          <span
            class="font-normal text-[16px] text-gray-600 dark:text-gray-300 relative z-40 -top-[4px] w-full flex items-center justify-center">أو</span>
          <span
            class="absolute w-[30px] h-[4px] bg-white dark:bg-gray-900 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30"></span>
          <span
            class="line-through absolute w-full h-[2px] bg-gray-100 dark:bg-gray-700 top-1/2 left-0 -translate-y-1/2 z-10"></span>
        </div>

        <button @click="continueWithGoogle"
          class="continue-with-google border mt-3 border-gray-200 dark:border-gray-700 flex items-center justify-center w-full py-3 gap-2 rounded-md font-normal text-gray-800 dark:text-gray-200 transition-all hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-500">
          <MdiIcon :icon="mdiGoogle" type="button" class="w-6 h-6 font-medium" stroke-width="100" />
          <span class="text-[17px] font-medium">المتابعة مع Google</span>
        </button>

        <!-- شروط الخدمة -->
        <span class="text-[12px] text-gray-400 dark:text-gray-500 block w-full text-center mt-6">بالمتابعة, انت توافق
          على شروط
          الخدمة وسياسة الخصوصية</span>
        <div class="flex items-center justify-center gap-2 mt-10">
          <span
            class="border-b-2 cursor-pointer transition-all hover:border-cyan-600 hover:text-cyan-600 text-[12px] border-cyan-500 pb-[2px] text-gray-800 dark:text-gray-200">شروط
            الخدمة</span>

          <span class="w-1 h-1 rounded-full bg-gray-800"></span>
          <span
            class="border-b-2 cursor-pointer transition-all hover:border-cyan-600 hover:text-cyan-600 text-[12px] border-cyan-500 pb-[2px] text-gray-800 dark:text-gray-200">سياسة
            الخصوصية</span>
        </div>
      </form>
      <div class="absolute right-8 top-6">
        <BackButton @click="router.push({ name: 'home' })" />
      </div>
    </div>
  </div>
</template>
