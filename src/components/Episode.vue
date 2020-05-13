<template>
  <div
    class="pt-1 pb-1 flex flex-col episode mr-2"
    :class="{ 'text-fourth': $props.isCurrentPodcast }"
  >
    <div class="flex w-full items-center">
      <i
        v-if="!$props.isPlaying"
        class="fa fa-play text-xs mr-2 cursor-pointer"
        :class="{ fadeIn: !$props.isCurrentPodcast }"
        @click="onClickEpisode"
      ></i>
      <i
        v-else
        class="fa fa-pause text-xs mr-2 cursor-pointer"
        @click="onClickEpisode"
      ></i>
      <span
        class="flex-grow cursor-pointer hover:underline truncate"
        @click="onClickEpisode"
      >
        {{ episode.name }}</span
      >
      <span> {{ msToTime(episode.duration_ms) }}</span>
    </div>
    <div
      class="text-sm ml-6 mr-12 mt-1 h-12 overflow-hidden cursor-pointer select-none episode__description"
      :class="{
        'h-auto episode__description--long': $props.isExpanded,
        'episode__description--short': !$props.isExpanded
      }"
      @click="$emit('expand', episode.id)"
    >
      {{ episode.description }}
    </div>
    <div
      class="text-xs w-full text-center text-white"
      :class="{ '-mt-5': !$props.isExpanded }"
    >
      <i
        class="fa fa-chevron-down "
        :class="{ 'fa-chevron-up': $props.isExpanded }"
      ></i>
    </div>
  </div>
</template>

<script>
import { getTracks } from "../../utils/SpotifyApi";
import { msToTime } from "../../utils/helper";
import { loadAnnotationsForEpisode } from "../../utils/AirtableApi";

async function onClickEpisode() {
  if (!this.$props.isCurrentPodcast) {
    let duration = this.episode.duration_ms;
    let notes = [];
    try {
      notes = await this.notesInfo();
    } catch (err) {
      // Privacy Badger
    }
    if (notes && notes.length) {
      for (let note of notes) {
        if (note.songs && note.songs.length) {
          note.songs = await getTracks({
            uris: note.songs,
            accessToken: this.$props.accessToken
          });
          duration += note.songs
            .map(({ duration_ms }) => duration_ms)
            .reduce((a, b) => a + b);
        }
      }
    }
    this.$emit("play", { track: this.episode, notes, duration });
  } else {
    if (this.$props.isPlaying) {
      this.$emit("pause");
    } else {
      this.$emit("play", { track: this.episode });
    }
  }
}

async function notesInfo() {
  const data = await loadAnnotationsForEpisode(this.episode.uri);
  // TODO: Combine link & linkTitle to a link: {url, title} Object
  return data.map(
    ({
      Episode: episode,
      Songs: songs,
      Link: link,
      LinkTitle: linkTitle,
      Infos: infos,
      Type: type,
      Time: time
    }) => {
      return {
        episode,
        songs,
        link,
        linkTitle,
        infos,
        type,
        time: time * 1000
      };
    }
  );
}

export default {
  name: "Episode",
  props: {
    episode: Object,
    isExpanded: Boolean,
    isPlaying: Boolean,
    isCurrentPodcast: Boolean,
    accessToken: String
  },
  methods: {
    msToTime,
    onClickEpisode,
    notesInfo
  }
};
</script>

<style>
.episode div.episode__description--short {
  opacity: 0.25;
}

.episode div.episode__description--long {
  opacity: 0.75;
}

.episode i.fa-chevron-up,
.episode i.fa-chevron-down {
  opacity: 0.75;
}

@media only screen and (min-width: 640px) {
  .episode div.episode__description,
  .episode i.fa {
    transition: opacity 0.2s ease-in-out;
  }

  .episode:hover i.fadeIn,
  .episode:hover i.fa.fa-chevron-down {
    opacity: 1;
  }

  .episode i.fadeIn,
  .episode i.fa.fa-chevron-down {
    opacity: 0;
  }

  .episode:hover div.episode__description--short {
    opacity: 0.1;
  }
}
</style>
