<template>
  <div class="p-4">
    <show
      :name="name"
      :images="images"
      :publisher="publisher"
      :description="description"
    />
    <episode
      v-for="episode in episodes.items"
      :key="episode.id"
      :episode="episode"
      :isPlaying="$props.isPlaying && episode.id === $props.currentPodcast"
      :isCurrentPodcast="episode.id === $props.currentPodcast"
      :isExpanded="expandedEpisode === episode.id"
      :accessToken="accessToken"
      @play="obj => $emit('play', obj)"
      @pause="$emit('pause')"
      @expand="expandEpisode"
    />
  </div>
</template>

<script>
import { getShow, PODCAST_ID } from "../../utils/SpotifyApi";
import Episode from "../components/Episode";
import Show from "../components/Show";

const data = {
  name: "",
  description: "",
  publisher: "",
  expandedEpisode: "",
  images: [],
  episodes: {}
};

async function setShow() {
  const data = await getShow({
    uri: PODCAST_ID,
    accessToken: this.$props.accessToken
  });
  this.episodes = data.episodes;
  this.name = data.name;
  this.description = data.description;
  this.publisher = data.publisher;
  this.images = data.images;
}

function expandEpisode(id) {
  this.expandedEpisode = this.expandedEpisode === id ? "" : id;
}

function accessToken(newAT, oldAT) {
  if (!oldAT && newAT) {
    this.setShow();
  }
}

export default {
  name: "Home",
  props: {
    accessToken: String,
    isPlaying: Boolean,
    currentPodcast: String
  },
  data() {
    return data;
  },
  components: {
    Episode,
    Show
  },
  methods: {
    setShow,
    expandEpisode
  },
  watch: { accessToken },
  mounted() {
    // If Website is in WebView the AccesToken is avaible on request
    if (this.$props.accessToken) {
      this.setShow();
    }
  }
};
</script>
