<template>
  <div
    class="modal opacity-0 pointer-events-none absolute w-full h-full top-0 left-0 flex items-center justify-center"
    :class="{
      'opacity-100 pointer-events-auto': isActive
    }"
  >
    <div
      class="modal-overlay absolute w-full h-full bg-black opacity-25 top-0 left-0 cursor-pointer"
    ></div>
    <div
      class="absolute w-full max-w-lg bg-second rounded-sm shadow-lg text-xl sm:text-lg"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Modal",
  props: {
    isActive: Boolean,
    showOverlay: Boolean
  }
};
</script>

<style>
.modal {
  transition: opacity 0.25s ease;
}
</style>