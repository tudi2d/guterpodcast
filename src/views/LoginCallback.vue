<template>
  <div></div>
</template>

<script>
import { parseHash, isWebView } from "../../utils/helper";

function mounted() {
  const params = parseHash(window.location.hash);
  const origin = window.opener;
  const location = window.location;
  if (isWebView() || !window.opener) {
    // would be nice to have a store...
    this.$router.push({ name: "Home", params });
  } else {
    origin.postMessage(params, location);
    window.onmessage = ({ data }) => {
      if (data === "close") {
        window.close();
      }
    };
  }
}

export default {
  name: "LoginCallback",
  mounted
};
</script>
