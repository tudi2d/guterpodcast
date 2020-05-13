<template>
  <modal :isActive="$props.isActive">
    <div class="flex flex-col items-center p-6">
      <h2 class="font-headline text-4xl">Dat gifft dat doch nich!</h2>
      <div class="flex flex-col mb-4">
        <span v-if="!isWebSDKWorking" class="mb-2">
          Öffne diese Website am besten an deinem Computer in
          <b>Google Chrome oder Mozilla Firefox</b>.
        </span>
        <span class="mb-2"> Aktiviere <b>Pop-ups</b> in deinem Browser </span>
        <span class="mb-2">
          Eventuell blockiert dein
          <b> Ad-Blocker oder Privacy Badger</b> Spotfiy. Deaktivere die Add-ons
          und lade die Website neu
        </span>
      </div>
      <icon-button
        @click="$emit('close')"
        text="Schließen"
        icon="fas fa-times"
      />
    </div>
  </modal>
</template>

<script>
import Modal from "./Modal";
import IconButton from "../IconButton";
import { isWebSDKWorking } from "../../../utils/helper";

export default {
  name: "ErrorModal",
  components: {
    Modal,
    IconButton
  },
  props: {
    isActive: Boolean
  },
  computed: { isWebSDKWorking }
};
</script>
