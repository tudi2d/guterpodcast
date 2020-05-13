<template>
  <div></div>
</template>

<script>
import { parseHash } from "../../utils/helper";

function mounted() {
  const origin = window.opener;
  const location = window.location;
  origin.postMessage(parseHash(window.location.hash), location);
  window.onmessage = ({ data }) => {
    if (data === "close") {
      window.close();
    }
  };
}

export default {
  name: "LoginCallback",
  mounted
};
</script>
