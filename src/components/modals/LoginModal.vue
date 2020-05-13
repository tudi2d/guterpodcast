<template>
  <modal :isActive="$props.isActive">
    <div class="flex flex-col items-center p-6">
      <h2 class="font-headline text-4xl">Moin!</h2>
      <div class="flex flex-col">
        <ol class="list-decimal mb-8 mt-2 ml-4">
          <li v-if="!isWebSDKWorking" class="mt-2">
            Öffne Spotify auf deinem Gerät
          </li>
          <li class="mt-2">
            Melde dich auf dieser Website mit deinem Spotify Account an
          </li>
          <li class="mt-2">
            Wähle dein Abspielgerät aus
          </li>
          <li class="mt-2">
            Höre <span class="text-fourth font-bold">Fest & Flauschig</span> mit
            Songs, Links & Infos
          </li>
        </ol>
      </div>
      <icon-button
        @click="$emit('login')"
        text="Los geht´s"
        icon="fab fa-spotify"
      />
    </div>
  </modal>
</template>

<script>
import IconButton from "../IconButton";
import Modal from "./Modal";
import { isWebSDKWorking } from "../../../utils/helper";

export default {
  name: "LoginModal",
  components: {
    IconButton,
    Modal
  },
  props: {
    isActive: Boolean
  },
  computed: {
    isWebSDKWorking
  }
};
</script>
