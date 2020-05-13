<template>
  <button
    class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
    @click="$emit('click')"
  >
    <i class="w-4 h-4 mr-2" :class="$props.icon"></i>
    <span>{{ $props.text }}</span>
  </button>
</template>

<script>
export default {
  name: "IconButton",
  props: { text: String, icon: String }
};
</script>
