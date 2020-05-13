<template>
  <div class="flex-grow flex flex-col mt-3 sm:mt-0">
    <div class="self-center text-4xl sm:text-2xl">
      <!-- <i
        class="fa fa-step-backward text-3xl sm:text-2xl"
        @click="$emit('backward')"
      ></i> -->
      <i
        v-if="$props.isPlaying"
        class="fa fa-pause ml-3 mr-3"
        @click="$emit('pause')"
      ></i>
      <i v-else class="fa fa-play ml-3 mr-3" @click="$emit('play')"></i>
      <!-- <i
        class="fa fa-step-forward text-3xl sm:text-2xl"
        @click="$emit('forward')"
      ></i> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "PlayerControl",
  props: {
    isPlaying: Boolean
  }
};
</script>