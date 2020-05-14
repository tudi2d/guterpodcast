<template>
  <div>
    <div class="mb-4 flex items-center">
      <img
        v-if="$props.images.length"
        class="h-24 mr-4"
        :src="$props.images[1].url"
        alt="Thumbnail for the show"
        :srcset="`${$props.images[0].url} 2000w, ${$props.images[1].url} 1000w`"
      />
      <div>
        <h2
          class="text-4xl font-mono font-headline mb-0 leading-none flex-grow"
        >
          {{ $props.name }}
        </h2>
        <span class="text-sm">{{ $props.publisher }}</span>
      </div>
    </div>
    <p class="mb-6">{{ $props.description }}</p>
  </div>
</template>

<script>
export default {
  name: "Show",
  props: {
    images: Array,
    name: String,
    publisher: String,
    description: String
  }
};
</script>
