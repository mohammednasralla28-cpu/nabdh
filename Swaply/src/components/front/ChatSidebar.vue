<script setup>
import axios from "axios";
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import axiosClient from "../../axiosClient";
import useFormats from "../../mixins/formats";
import { useAuthStore } from "../../stores/auth/auth";
import { storeToRefs } from "pinia";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  numberOfUnRedChat: {
    type: Number,
    default: 0,
  },
});

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const { getRelativeTime } = useFormats();
const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
const emit = defineEmits([
  "update:modelValue",
  "update:numberOfUnRedChat",
  "chatWith",
]);
const conversations = ref([]);

watch(
  dialog,
  async (val) => {
    if (val) {
      document.body.style.overflow = "hidden";
      await fetchConversations();
    } else {
      document.body.style.overflow = "";
    }
  },
  {
    immediate: true,
  }
);
const fetchConversations = async () => {
  try {
    const response = await axiosClient.get("/chat/conversations");
    if (response.status == 200) {
      conversations.value = response.data.conversations;
      emit(
        "update:numberOfUnRedChat",
        response.data.conversations_with_unread_count
      );
    }
  } catch (e) {
  }
};
onMounted(async () => {
  await fetchConversations();
});

const getName = (conversation) => {
  return conversation.user_one.id === user.value?.id
    ? conversation.user_two.name
    : conversation.user_one.name;
};

const openChat = (conversation) => {
  if (conversation.unread_count) {
    emit("update:numberOfUnRedChat", props.numberOfUnRedChat - 1);

    conversation.unread_count = 0;
  }
  conversation.user_two.conversation_id = conversation.id;
  conversation.user_one.conversation_id = conversation.id;
  emit(
    "chatWith",
    conversation.user_one.id === user.value?.id
      ? conversation.user_two
      : conversation.user_one
  );
};

onBeforeUnmount(() => {
  document.body.style.overflow = "";
});
</script>

<template>
  <div
    class="scrollbar-hide overflow-auto h-screen fixed top-0 w-[400px] bg-white dark:bg-gray-900 shadow-lg transition-all duration-300 z-[1000000] pt-8"
    :class="{ '-right-full': !dialog, 'right-0': dialog }">
    <div class="text-center font-medium text-[24px] mb-4 text-blue-600 dark:text-blue-400">
      محادثاتك
    </div>
    <!-- <pre>
      {{ conversations }}
    </pre> -->
    <div>
      <template v-if="conversations.length">
        <template v-for="conversation in conversations" :key="conversation.id">
          <div
            class="flex items-center relative px-4 gap-4 last-of-type:border-none border-b border-gray-200 dark:border-gray-700 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            @click="openChat(conversation)">
            <div
              class="image bg-blue-500 dark:bg-blue-700 text-white font-medium w-12 h-12 rounded-full flex items-center justify-center">
              {{
                (getName(conversation) || "")
                  .split(" ")
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()
              }}
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-gray-900 dark:text-gray-100 font-normal">{{
                getName(conversation)
              }}</span>
              <span class="text-gray-500 dark:text-gray-400 text-[14px]">
                {{
                  conversation.last_message_sender_id === user.id ? "أنت: " : ""
                }}
                {{ conversation.last_message_body }}</span>
            </div>
            <span class="flex-1" />
            <div class="self-end text-[12px] text-gray-400 dark:text-gray-500">
              <span>{{
                getRelativeTime(conversation.last_message_date).replace(
                  "قبل",
                  "منذ"
                )
              }}</span>
            </div>
            <span v-if="conversation.unread_count > 0"
              class="absolute left-4 top-1/2 -translate-y-1/2 -mt-2 bg-red-600 text-white text-sm rounded-full w-5 h-5 flex justify-center items-center">{{
                conversation.unread_count }}</span>
          </div>
        </template>
      </template>
      <template v-else>
        <p class="text-gray-600 w-fit mx-auto mt-8 font-normal">
          لا يوجد لديك اي محادثات
        </p>
      </template>
    </div>
  </div>

  <!-- overlay -->
  <div class="bg-black/30 fixed top-0 left-0 w-screen h-screen z-[900] transition-opacity" :class="{ hidden: !dialog }"
    @click="dialog = false"></div>
  <!-- </div> -->
</template>

<style lang="scss" scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
