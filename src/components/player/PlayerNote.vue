<template>
  <tooltip
    class="player__note tooltip absolute h-6 -mt-3 bg-white rounded z-10 cursor-pointer"
    :style="{
      left: `${position}%`,
      paddingRight: `${duration}%`
    }"
    :isActive="$props.isActive"
    @mouseover="ev => $emit('mouseover', $vnode.key)"
    @mouseleave="$emit('mouseleave')"
  >
    <div v-if="song" class="w-40 text-sm flex flex-col">
      <img class="w-24 h-24 self-center mb-2" :src="url" alt="Song thumbnail" />
      <div>
        <span class="block font-bold truncate">{{ song.name }} </span
        ><span class="truncate">{{ artist }} </span>
      </div>
    </div>
    <div v-else-if="info" class="w-40 text-sm flex flex-col">
      <i class="fas fa-info absolute left-0 top-0 m-2 text-xs"></i>
      {{ info }}
    </div>
    <div v-else-if="link" class="w-40 text-sm flex flex-col">
      <i class="fas fa-link absolute left-0 top-0 m-2 text-xs"></i>
      <a :href="link" target="_blank" class="underline font-bold">{{
        $props.note.title
      }}</a>
    </div>
  </tooltip>
</template>

<script>
import Tooltip from "../Tooltip";

function notePosition(time, index) {
  return (this.notesTime[index] / this.duration) * 100;
}

export default {
  name: "PlayerNote",
  components: {
    Tooltip
  },
  props: {
    note: Object,
    isActive: Boolean,
    position: Number,
    duration: Number
  },
  methods: {
    notePosition
  },
  computed: {
    url() {
      return this.note.song.album.images[1].url;
    },
    artist() {
      return this.$props.note.song.artists[0].name;
    },
    song() {
      return this.$props.note.song;
    },
    info() {
      return this.$props.note.info;
    },
    link() {
      return this.$props.note.link;
    }
  }
};
</script>