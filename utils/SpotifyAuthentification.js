import { fetchSpotify } from "./SpotifyApi";

// Important! Changing the path needs a change in the Spotify API Dashboard!
export const LOGIN_CALLBACK_URL = "/login/callback";
export const REDIRECT_URI = `${window.location.origin}${LOGIN_CALLBACK_URL}`;

const SCOPE = [
  "streaming",
  "user-read-playback-state",
  "user-modify-playback-state"
].join("%20");

const CLIENT_ID =
  process.env.NODE_ENV === "development"
    ? "f1f35e630fc447bb96826c3a505cebbc"
    : "1e6d937577dc4a759a8fd5d2419fff19";
export const LOGIN_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}`;

export function spotifyLogin() {
  return new Promise((resolve, reject) => {
    const popup = window.open(
      LOGIN_URL,
      "_blank",
      "width=700,height=750,toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0"
    );
    if (popup) {
      const location = window.location;

      window.onmessage = async event => {
        const { access_token: accessToken } = event.data;
        if (accessToken) {
          popup.postMessage("close", location);
          try {
            const profile = await fetchSpotify({
              url: "/me",
              accessToken
            });
            resolve({ accessToken, profile });
          } catch (err) {
            // PRIVACY BADGER OR ADBLOCKER BLOCKS SPOTIFY API REQUEST
            reject("LOGIN_FAILED");
          }
        }
      };
    } else {
      // LOGIN OPENED IN TAB..
      reject("LOGIN_FAILED");
    }
  });
}
