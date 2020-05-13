<template>
  <div
    class="tooltip"
    @click="ev => $emit('click', ev)"
    @mouseover="ev => $emit('mouseover', $vnode.key)"
    @mouseleave="$emit('mouseleave')"
  >
    <div
      v-if="isActive"
      @mouseover="ev => $emit('mouseover', $vnode.key)"
      @mouseleave="$emit('mouseleave')"
      class="tooltip__content -ml-24 opacity-0 absolute bg-third text-white text-center p-4 rounded"
      :class="{ 'visible opacity-100': isActive }"
      :style="{ zIndex: isActive ? 10 : -10 }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Tooltip",
  props: { isActive: Boolean }
};
</script>

<style lang="css" scoped>
.tooltip .tooltip__content {
  bottom: 125%;
  left: 50%;
  transition: opacity 0.5s;
}

.tooltip .tooltip__content::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  /* TODO: Reference tailwind theme */
  border-color: #798fa6 transparent transparent transparent;
}
</style>
