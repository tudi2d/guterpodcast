<template>
  <main
    class="flex flex-col bg-first text-white overflow-hidden"
    :class="{
      'h-auto': accessToken || $route.name === 'Impressum',
      'h-screen': !accessToken && !($route.name === 'Impressum')
    }"
  >
    <navigation-bar />
    <login-modal
      :isActive="!accessToken && $route.path === '/'"
      @login="onLogin"
    />
    <error-modal :isActive="!!error" @close="resetError" />
    <router-view
      class="self-center transition-transform transform min-h-screen duration-1000 ease-in-out bg-second rounded shadow-2xl mt-8 sm:mt-24 mb-24 sm:mb-20 xl:w-1/2 lg:w-2/3 sm:w-2/3 w-full"
      :class="{
        'translate-y-0': accessToken || $route.name === 'Impressum',
        'translate-y-full': !accessToken && !($route.name === 'Impressum')
      }"
      :accessToken="accessToken"
      :isPlaying="isPlaying"
      :currentPodcast="podcast.track.id"
      @play="onPlay"
      @pause="onPause"
    />
    <footer
      class="fixed bottom-0 h-24 sm:h-16 bg-second w-full transition transform duration-500 ease-in-out"
      :class="{
        'translate-y-0': showPlayer,
        'translate-y-32': !showPlayer
      }"
    >
      <!-- Overlay, which blocks unwanted episode change -->
      <div class="absolute h-4 -m-4 w-full"></div>
      <player
        v-if="showPlayer"
        :accessToken="accessToken"
        :currentTime="currentTime"
        :currentDeviceId="currentDeviceId"
        :isPlaying="isPlaying"
        :devices="devices"
        :podcast="podcast"
        :isDevicesActive="isDevicesActive"
        @deviceChange="onDeviceChange"
        @getDevices="getDevices"
        @pause="onPause"
        @play="onPlay"
        @toggleDevices="onToggleDevices"
        @timeChange="timeChange"
      />
    </footer>
  </main>
</template>

<script>
import Player from "./components/player/Player";
import {
  pause,
  play,
  fetchSpotify,
  initPlayer,
  continueOnDevice,
  current,
  seek
} from "../utils/SpotifyApi";
import {
  timesFromNotes,
  songTime,
  timeWithNotes,
  isWebSDKWorking,
  timeWithoutNotes
} from "../utils/helper";
import { spotifyLogin } from "../utils/SpotifyAuthentification";
import LoginModal from "./components/modals/LoginModal";
import ErrorModal from "./components/modals/ErrorModal";
import NavigationBar from "./components/NavigationBar";

const data = {
  currentTime: 0,
  podcast: { duration: 0, track: {}, notes: [], position: 0 },
  intervals: [],
  accessToken: "",
  isPlaying: false,
  isPlayerReady: false,
  profile: {},
  devices: [],
  currentDeviceId: "",
  error: "",
  isDevicesActive: false
};

async function getDevices() {
  const { devices } = await fetchSpotify({
    url: "/me/player/devices",
    accessToken: this.accessToken
  });
  this.devices = devices;
}

async function onLogin() {
  try {
    const { accessToken, profile } = await spotifyLogin();
    if (accessToken) {
      this.accessToken = accessToken;
      this.profile = profile;
      if (isWebSDKWorking()) {
        const webSDK = document.createElement("script");
        webSDK.setAttribute("src", "https://sdk.scdn.co/spotify-player.js");
        document.body.appendChild(webSDK);
        window.onSpotifyWebPlaybackSDKReady = async () => {
          const player = await initPlayer(accessToken);
          player.addListener("ready", this.onPlayerReady);
          player.addListener("player_state_changed", this.onPlayerStateChange);
          player.addListener("initialization_error", ({ message }) => {
            this.error = message;
          });
        };
      } else {
        this.getDevices();
        this.addPlayerStateInterval();
      }
    }
  } catch (error) {
    this.error = error;
  }
}

function createTimeInterval() {
  return window.setInterval(() => {
    this.currentTime += 500;
  }, 500);
}

function clearAllIntervals() {
  for (let i of this.intervals) {
    window.clearInterval(i);
  }
  this.intervals = [];
}

async function triggerPlayerStateChange() {
  let {
    is_playing,
    progress_ms,
    item,
    currently_playing_type,
    device
  } = await current({
    accessToken: this.accessToken
  });
  if (!this.currentDeviceId || (device && this.currentDeviceId != device.id)) {
    this.currentDeviceId = device.id;
  }
  if (currently_playing_type === "episode" && !item) {
    item = { uri: this.podcast.track.uri };
  }
  item.uri = this.onPlayerStateChange({
    paused: !is_playing,
    position: progress_ms,
    // Item is 'null' for podcasts
    duration: item ? item.duration_ms : 0,
    track_window: { current_track: item }
  });
}

async function addPlayerStateInterval() {
  await this.triggerPlayerStateChange();
  return window.setInterval(async () => {
    await this.triggerPlayerStateChange();
  }, 20000);
}

async function onPlayerReady({ device_id }) {
  this.isPlayerReady = true;
  this.currentDeviceId = device_id;
}

async function onDeviceChange(id) {
  if (id !== this.currentDeviceId) {
    await fetchSpotify({
      url: "/me/player/",
      accessToken: this.accessToken,
      method: "PUT",
      data: {
        device_ids: [id]
      }
    });
    for (const device of this.devices) {
      device.is_active = device.id === id;
    }
    this.currentDeviceId = id;
  }
}

async function playTrack(playRequest) {
  this.clearAllIntervals();
  playRequest.accessToken = this.accessToken;
  playRequest.deviceId = this.currentDeviceId;
  await play(playRequest);
  this.isPlaying = true;
  this.intervals.push(this.createTimeInterval());
}

async function continueTrack() {
  this.clearAllIntervals();
  await continueOnDevice({
    accessToken: this.accessToken,
    deviceId: this.currentDeviceId
  });
  this.isPlaying = true;
  this.intervals.push(this.createTimeInterval());
}

function onPlayerStateChange(data) {
  if (data) {
    const {
      paused,
      position,
      track_window: { current_track }
    } = data;
    if (this.isPlaying && paused) {
      this.isPlaying = false;
      this.clearAllIntervals();
    } else if (!this.isPlaying && !paused) {
      if (!this.uri) {
        // Did not start a podcast; Still listens to music on other device
        return;
      }
    }
    if (current_track && current_track.uri === this.podcast.track.uri) {
      /* For some reason changing the episode with a position_ms causes 3 state events and not 2 like the other changes.
      The second state event returns the position in second instead of milliseconds.
      The third then corrects that. */
      // TODO: Try to recreate this issue and report it
      const times = timesFromNotes(this.podcast.notes);
      let wrongUpdate = false;
      for (const time of times) {
        if (position === (time + 1) / 1000) {
          wrongUpdate = true;
          break;
        }
      }
      if (!wrongUpdate) {
        this.currentTime = timeWithNotes({
          time: position,
          notes: this.podcast.notes
        });
      }
    } else if (
      current_track &&
      current_track.duration_ms &&
      !(
        current_track.duration_ms - 500 < this.podcast.track.duration_ms &&
        current_track.duration_ms + 500 > this.podcast.track.duration_ms
      )
    ) {
      /* When playing a track during a podcast episode there is an event where the URI, title, etc. of the current track
      already changes but the duration & position do not. Also the duration is not the same (!) like the duration of the inital loaded podcast.
      There is a little deviation. I could not find a similarity in the deviation. I just hope the 1 second interval will fix it for now... */
      this.currentTime =
        songTime({
          uri: current_track.uri,
          notes: this.podcast.notes
        }).start + position;
    }
  }
}

async function onPause() {
  await pause({ accessToken: this.accessToken });
  this.isPlaying = false;
  this.clearAllIntervals();
}

async function onPlay({
  duration = 0,
  track = {},
  songs = [],
  notes = [],
  position = 0
}) {
  if (this.currentDeviceId) {
    const { track: currentTrack } = this.podcast;
    let playRequest = {};
    if (track.uri) {
      // Play a specific podcast
      if (this.isPlaying) {
        if (currentTrack.uri === track.uri) {
          if (position) {
            playRequest = {
              uris: [track.uri],
              position_ms: position
            };
          }
        } else {
          // Play different podcast
          playRequest = {
            uris: [track.uri],
            position_ms: 0
          };
        }
      } else {
        if (currentTrack.uri === track.uri) {
          // Continue
          this.continueTrack();
          return;
        } else {
          // Play different podcast
          playRequest = {
            uris: [track.uri]
          };
        }
      }
    } else if (songs.length) {
      // Queue of songs
      playRequest = {
        uris: songs.map(({ uri }) => uri),
        position_ms: position
      };
    } else {
      // TODO: Play first podcast of show
      return;
    }
    this.playTrack(playRequest);
    if (track.uri) {
      this.podcast = { track, notes, duration, position };
      if (!position) {
        this.currentTime = 0;
      }
    }
  } else {
    this.onToggleDevices();
  }
}

async function timeChange(time) {
  let { currently_playing_type } = await current({
    accessToken: this.accessToken
  });
  if (currently_playing_type === "episode") {
    await seek({
      accessToken: this.accessToken,
      deviceId: this.currentDeviceId,
      position_ms: timeWithoutNotes({ time, notes: this.podcast.notes })
    });
  } else {
    this.playTrack({
      uris: [this.podcast.track.uri],
      position_ms: timeWithoutNotes({
        time,
        notes: this.podcast.notes
      })
    });
  }
  if (!isWebSDKWorking()) {
    await this.triggerPlayerStateChange();
  }
}

function resetError() {
  this.error = "";
}

function showPlayer() {
  return this.isPlayerReady || (!isWebSDKWorking() && this.accessToken);
}

function onToggleDevices() {
  if (!this.isDevicesActive) {
    this.getDevices();
  }
  this.isDevicesActive = !this.isDevicesActive;
}

export default {
  name: "App",
  components: {
    Player,
    LoginModal,
    ErrorModal,
    NavigationBar
  },
  data() {
    return data;
  },
  computed: {
    showPlayer
  },
  methods: {
    createTimeInterval,
    clearAllIntervals,
    onPlayerReady,
    onPlayerStateChange,
    isWebSDKWorking,
    playTrack,
    continueTrack,
    onLogin,
    addPlayerStateInterval,
    getDevices,
    onDeviceChange,
    triggerPlayerStateChange,
    onPause,
    onPlay,
    timeChange,
    resetError,
    onToggleDevices
  }
};
</script>
