<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
});
defineOptions({
  inheritAttrs: false,
});
</script>
<template>
  <button
    :class="[$attrs.class]"
    class="flex-1 flex items-center gap-3 w-full justify-center p-[6px] border-2 transition-all rounded-lg text-[14px]"
    @click="$emit('click')"
  >
    <slot name="icon" />
    <span class="font-[500] text-[13px]">{{ title }}</span>
  </button>
</template>