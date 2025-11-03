<script setup>
import { ref, watch, onBeforeUnmount, nextTick } from "vue";
import axiosClient from "../../axiosClient";
import { CheckIcon } from "@heroicons/vue/24/solid";
import {
  ChatBubbleOvalLeftIcon,
  MinusIcon,
  PaperAirplaneIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import { echo } from "../../echo";
import { useAuthStore } from "../../stores/auth/auth";
import { storeToRefs } from "pinia";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const props = defineProps({
  isOpen: { type: Boolean, default: true },
  with: { type: Object, default: () => ({}) },
  isUser: { type: Boolean, default: false },
});

const emit = defineEmits(["update:isOpen"]);

const chatApp = ref(null);
const contentEl = ref(null);
const messages = ref([]);
const message = ref("");
const loading = ref(false);
const loadingMore = ref(false);
const currentPage = ref(1);
const lastPage = ref(1);
const isOpenFull = ref(true);
const channel = ref(null);
const lastChannelName = ref(null);
const currentUserId = ref(null);
const conversationId = ref(null);

const getChannelName = () => {
  if (conversationId.value) {
    return `private-conversation.${conversationId.value}`;
  }
  return null;
};

const destroyEcho = () => {
  if (channel.value) {
    try {
      channel.value.stopListening("MessageSent");
      if (lastChannelName.value && echo) {
        try {
          echo.leave(lastChannelName.value);
        } catch (e) { }
      }
    } catch (e) { }
    channel.value = null;
    lastChannelName.value = null;
  }
};

const subscribeToChannel = () => {
  destroyEcho();

  if (!echo) return;
  if (!props.with?.id) return;

  const channelName = getChannelName();
  if (!channelName) return;

  lastChannelName.value = channelName;
  channel.value = echo.private(channelName);

  channel.value.listen(".MessageSent", (e) => {
    const incoming = e.message ?? e;
    if (!incoming || !incoming.id) return;
    if (incoming.senderId === user.value?.id) return;
    if (messages.value.some((m) => m.id === incoming.id)) return;
    messages.value.push(incoming);
    nextTick(() => {
      if (isNearBottom()) scrollToBottom();
    });
  });
};

const fetchChatMessages = async (page = 1) => {
  let route = "";
  if (props.isUser) {
    route = `/chat/conversations/get-messages/${props.with.id}?page=${page}`;
  } else {
    route = `/chat/conversations/${props.with.conversation_id}/get-messages?page=${page}`;
  }
  if (page === 1) loading.value = true;
  else loadingMore.value = true;
  try {
    const response = await axiosClient.get(route);

    if (response.status === 200) {
      const payload = response.data;

      conversationId.value = payload.conversation_id ?? conversationId.value;
      const pag = payload.messages;
      const dataArr = Array.isArray(pag?.data) ? pag.data : [];
      const reversed = [...dataArr].reverse();

      if (page === 1) {
        messages.value = reversed;
        await nextTick();
        scrollToBottom();
      } else {
        const el = contentEl.value;
        const oldScrollHeight = el ? el.scrollHeight : 0;
        const oldScrollTop = el ? el.scrollTop : 0;
        messages.value.unshift(...reversed);
        await nextTick();
        if (el) {
          el.scrollTop = el.scrollHeight - oldScrollHeight + oldScrollTop;
        }
      }

      currentPage.value = pag?.current_page ?? page;
      lastPage.value = pag?.last_page ?? page;

      if (payload.current_user_id)
        currentUserId.value = payload.current_user_id;

      if (conversationId.value) {
        destroyEcho();
        subscribeToChannel();
      }
    }
  } catch (e) {
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

const handleScroll = (e) => {
  const el = e.target;
  if (!el) return;
  if (
    el.scrollTop <= 10 &&
    !loadingMore.value &&
    currentPage.value < lastPage.value
  ) {
    fetchChatMessages(currentPage.value + 1);
  }
};

const isNearBottom = () => {
  const el = contentEl.value;
  if (!el) return false;
  return el.scrollTop + el.clientHeight >= el.scrollHeight - 150;
};

const scrollToBottom = () => {
  const el = contentEl.value;
  if (!el) return;
  el.scrollTop = el.scrollHeight;
};

const sendMessage = async () => {
  const body = message.value.trim();
  if (!body) return;
  const tempId = `tmp-${Date.now()}`;
  const nowISO = new Date().toISOString();
  const tempMsg = {
    id: tempId,
    body,
    sender_id: user.value?.id,
    created_at: nowISO,
    status: "sending",
  };
  messages.value.push(tempMsg);
  message.value = "";
  await nextTick();
  scrollToBottom();
  try {
    const res = await axiosClient.post(
      `/chat/messages/${conversationId.value}`,
      {
        receiver_id: props.with.id,
        content: body,
      }
    );
    if (res.status === 200) {
      const saved = res.data.message ?? res.data;
      const idx = messages.value.findIndex((m) => m.id === tempId);
      if (idx !== -1) messages.value.splice(idx, 1, saved);
      else if (!messages.value.some((m) => m.id === saved.id))
        messages.value.push(saved);
      await nextTick();
      scrollToBottom();
    }
  } catch (e) {
    const idx = messages.value.findIndex((m) => m.id === tempId);
    if (idx !== -1) messages.value[idx].status = "failed";
  }
};

const closeChat = () => {
  emit("update:isOpen", false);
  if (chatApp.value) chatApp.value.style.top = "196px";
  isOpenFull.value = true;
  destroyEcho();
};

const reizeChat = () => {
  if (isOpenFull.value) {
    if (chatApp.value) chatApp.value.style.bottom = "-21rem";
    isOpenFull.value = false;
    return;
  }
  if (chatApp.value) chatApp.value.style.bottom = "1rem";
  isOpenFull.value = true;
};

watch(
  () => props.isOpen,
  async (newVal) => {
    if (newVal) {
      await fetchChatMessages(1);
      subscribeToChannel();
      nextTick(() => {
        const el = contentEl.value;
        if (el) el.addEventListener("scroll", handleScroll);
      });
    } else {
      const el = contentEl.value;
      if (el) el.removeEventListener("scroll", handleScroll);
      destroyEcho();
    }
  }
);


onBeforeUnmount(() => {
  const el = contentEl.value;
  if (el) el.removeEventListener("scroll", handleScroll);
  destroyEcho();
});
</script>


<template>
  <div class="fixed bottom-4 right-9 bg-white dark:bg-gray-800 shadow-2xl z-50 rounded-lg w-80 transition-all"
    ref="chatApp" v-if="isOpen">
    <div class="border-b border-gray-200 dark:border-gray-700 mb-0">
      <div class="p-5 flex items-center justify-between">
        <div class="info flex items-center gap-2">
          <div
            class="icon text-black dark:text-white text-[12px] font-medium bg-gray-100 dark:bg-gray-700 h-9 w-9 flex items-center justify-center rounded-full">
            <span>{{
              (props.with.name || "")
                .split(" ")
                .map((p) => p[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()
            }}</span>
          </div>
          <div>
            <span class="font-medium flex">
              <span class="text-black dark:text-white text-[14px]">{{
                props.with.name
              }}</span>
              <span v-if="props.with.is_trusty"
                class="text-[11px] border border-gray-200 dark:border-gray-600 w-[18px] h-[18px] rounded-full flex items-center gap-1 ml-2 justify-center mr-2">
                <CheckIcon class="w-3 h-3 text-gray-600 dark:text-gray-300" />
              </span>
            </span>
            <div class="degree text-gray-600 dark:text-gray-400 text-[12px] font-medium mt-1">
              درجة الثقة 80%
            </div>
          </div>
        </div>
        <div class="icon flex items-center gap-2">
          <MinusIcon class="h-[18px] w-[18px] cursor-pointer text-black dark:text-white hover:opacity-70"
            @click="reizeChat()" v-if="isOpenFull" />
          <ChatBubbleOvalLeftIcon v-else
            class="h-[18px] w-[18px] cursor-pointer text-black dark:text-white hover:opacity-70" @click="reizeChat()" />
          <XMarkIcon class="h-[18px] w-[18px] cursor-pointer text-black dark:text-white hover:opacity-70"
            @click="closeChat()" />
        </div>
      </div>
    </div>

    <div class="content has-scroll p-5 h-64 overflow-y-auto scrollbar-hide" ref="contentEl">
      <div v-if="loading" class="text-center py-2 text-gray-500">
        جاري التحميل...
      </div>

      <template v-for="msg in messages" :key="msg.id">
        <div v-if="msg.sender_id === user.id"
          class="send-message bg-black dark:bg-blue-600 rounded-xl p-3 w-fit mb-4 max-w-56 pb-2 ml-auto text-right">
          <p class="text-white text-[13px]">{{ msg.body }}</p>
          <span class="time text-gray-400 text-[11px]">{{ msg.created_at && !isNaN(new Date(msg.created_at)) ? new
            Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "الآن" }}</span>
        </div>

        <div v-else
          class="recived-message bg-gray-200 dark:bg-gray-700 rounded-xl p-3 pb-2 w-fit mb-4 max-w-56 mr-auto">
          <p class="text-black dark:text-white text-[13px]">{{ msg.body }}</p>
          <span class="time text-gray-400 text-[11px]">{{ msg.created_at && !isNaN(new Date(msg.created_at)) ? new
            Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "الآن" }}</span>
        </div>
      </template>

      <div v-if="loadingMore" class="text-center py-2 text-gray-500">
        تحميل أقدم الرسائل...
      </div>
    </div>

    <div class="send p-4 flex items-center gap-2 border-t border-gray-200 dark:border-gray-700">
      <input type="text" v-model="message" @keyup.enter="sendMessage()" placeholder="اكتب رسالتك..."
        class="focus:border-gray-500 focus:ring-gray-500 rounded-md bg-gray-100 dark:bg-gray-700 text-black dark:text-white block w-full placeholder:text-[14px] placeholder:font-normal placeholder:text-gray-500 dark:placeholder:text-gray-400" />
      <button @click="sendMessage"
        class="text-white rounded-lg w-14 h-10 inline-flex items-center justify-center transition" :class="{
          'bg-black dark:bg-blue-600': message.length,
          'bg-gray-500 cursor-not-allowed': !message.length,
        }">
        <PaperAirplaneIcon class="w-[22px] h-[22px] -rotate-[45deg]" />
      </button>
    </div>
  </div>
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
