<template>
  <div v-if="$props.devices.length" class="w-40 text-left">
    <div
      v-for="device of $props.devices"
      class="flex items-baseline mb-1 text-xl sm:text-base opacity-75 hover:opacity-100"
      :class="{ 'text-second opacity-100': device.is_active }"
      :key="device.id"
      @click="ev => $emit('deviceChange', device.id)"
    >
      <i
        class="mr-3 sm:mr-2 w-5 text-center"
        :class="getDeviceIcon(device.type)"
      ></i>
      <span class="flex-grow truncate">
        {{ device.name }}
      </span>
    </div>
  </div>
  <div class="w-40 text-left" v-else>
    <i
      class="refresh fas fa-redo absolute right-0 mr-4 transition-transform ease-in-out duration-200"
      @click.stop="$emit('refreshDevices')"
    ></i>
    <span class="font-bold">Gerät verbinden</span> <br />
    <span class="text-sm"
      >Öffne Spotify auf einem deiner Geräte und aktualisiere diese Liste</span
    >
  </div>
</template>

<script>
// static, but only specifically usefull for this component
function getDeviceIcon(type) {
  switch (type) {
    case "Computer":
      return "fas fa-laptop";
    case "Tablet":
      return "fas fa-tablet";
    case "Mobile":
    case "Smartphone":
      return "fas fa-mobile";
    case "TV":
      return "fas fa-tv";
    case "Speaker":
    default:
      return "fas fa-headphones";
  }
}

export default {
  name: "Devices",
  props: {
    devices: Array,
    accessToken: String,
    device: { id: String, is_active: Boolean }
  },
  methods: {
    getDeviceIcon
  }
};
</script>
<style scoped>
.refresh:active {
  transform: rotate(45deg);
}
</style>
