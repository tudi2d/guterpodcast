<template>
  <div>
    <div class="player__notes absolute">
      <player-note
        v-for="(note, index) in displayNotes"
        :note="note"
        :position="notePosition(note.time, index)"
        :duration="songDuration(note.time, index)"
        @mouseover="mouseOverTooltip"
        @mouseleave="mouseLeaveTooltip"
        :isActive="index === activeTooltip"
        :key="index"
      />
    </div>
    <input
      class="flex z-10 select-none"
      type="range"
      :disabled="isMobile()"
      :value="currentTime"
      min="0"
      :max="duration"
      @change="ev => $emit('timeChange', Number(ev.target.value))"
    />
    <div
      class="flex text-lg sm:text-base w-full items-end sm:items-center pl-4 pr-4"
    >
      <span class="mb-3 sm:m-0">{{ msToTime(currentTime) }}</span>
      <player-control
        :isPlaying="isPlaying"
        @backward="$emit('backward')"
        @forward="$emit('forward')"
        @play="$emit('play', $props.podcast)"
        @pause="$emit('pause')"
      />
      <span class="mb-3 sm:m-0">{{ msToTime(this.duration) }}</span>
    </div>
    <!-- Baby mach sie an, die Bluetooth-Box... -->
    <div class="absolute right-0 top-0 mt-8 pt-1 sm:mt-4 mr-24">
      <i class="fa fa-desktop mt-1 text-3xl sm:mt-0 sm:text-2xl opacity-50"></i>
      <tooltip
        class="tooltip absolute h-8 w-8 -mt-10 sm:-mt-8 cursor-pointer"
        @click="$emit('toggleDevices')"
        :isActive="$props.isDevicesActive"
      >
        <devices
          :devices="$props.devices"
          :accessToken="$props.accessToken"
          @refreshDevices="$emit('getDevices')"
          @deviceChange="id => $emit('deviceChange', id)"
        />
      </tooltip>
    </div>
  </div>
</template>

<script>
import {
  msToTime,
  timesFromNotes,
  songsDuration,
  noteDuration,
  timeWithNotes,
  timeWithoutNotes,
  notesToDisplay,
  isWebSDKWorking,
  isMobile
} from "../../../utils/helper";
import Tooltip from "../Tooltip";
import Devices from "../Devices";
import PlayerNote from "./PlayerNote";
import PlayerControl from "./PlayerControl";

const data = {
  activeTooltip: -1
};

function notePosition(time, index) {
  return (this.notesTime[index] / this.duration) * 100;
}

function songDuration(time, index) {
  return (this.songsDuration[index] / this.duration) * 100;
}

function onSongClick() {
  // console.log(uri);
}

function mouseOverTooltip(index) {
  this.activeTooltip = index;
}
function mouseLeaveTooltip() {
  this.activeTooltip = -1;
}

/**
 * WATCH
 * Will fire every 500ms & check if a current node is reached and
 * if a song should interrupt the current podcast
 * TODO: Optimize this!
 */
function currentTime(newTime, oldTime) {
  for (let i = 0; i < this.displayNotes.length; i++) {
    if (
      newTime >= this.displayNotes[i].time &&
      oldTime < this.displayNotes[i].time
    ) {
      this.activeTooltip = i;
      window.setTimeout(() => {
        this.activeTooltip = -1;
      }, 5000);
    }
  }

  for (let i = 0; i < this.notes.length; i++) {
    const startOfNote = timeWithNotes({
      time: this.notes[i].time,
      notes: this.notes
    });
    const endOfNote = startOfNote + noteDuration(this.notes[i]);
    if (
      newTime >= startOfNote &&
      oldTime < startOfNote &&
      newTime < endOfNote
    ) {
      this.$emit("play", {
        songs: this.notes[i].songs
      });
      break;
    } else if (
      newTime >= endOfNote &&
      oldTime < endOfNote &&
      oldTime > startOfNote
    ) {
      this.$emit("play", {
        ...this.$props.podcast,
        position: this.notes[i].time + 1
      });
      break;
    }
  }
}

function currentDeviceId(newId, oldId) {
  if (!oldId && newId) {
    if (this.$props.isDevicesActive) {
      this.$emit("toggleDevices");
    }
  }
}

export default {
  name: "Player",
  components: {
    Tooltip,
    Devices,
    PlayerNote,
    PlayerControl
  },
  data() {
    return data;
  },
  props: {
    podcast: { duration: Number, track: Object, notes: Array },
    isDevicesActive: Boolean,
    currentTime: Number,
    accessToken: String,
    isPlaying: Boolean,
    currentDeviceId: String,
    devices: Array
  },
  methods: {
    msToTime,
    notePosition,
    songDuration,
    onSongClick,
    mouseOverTooltip,
    mouseLeaveTooltip,
    isWebSDKWorking,
    timeWithoutNotes,
    isMobile
  },
  computed: {
    notes() {
      return this.$props.podcast.notes;
    },
    duration() {
      return this.$props.podcast.duration;
    },
    songsDuration() {
      return songsDuration(this.displayNotes);
    },
    displayNotes() {
      return notesToDisplay(this.notes);
    },
    notesTime() {
      return timesFromNotes(this.displayNotes);
    }
  },
  watch: {
    currentTime,
    currentDeviceId
  },
  mounted() {
    if (!isWebSDKWorking()) {
      this.$emit("toggleDevices");
    }
  }
};
</script>

<style lang="css" scoped>
.player__notes {
  width: calc(100% - 24px + 4px);
  left: 12px;
}

.player__note {
  width: 8px;
  margin-left: -4px;
}
</style>
