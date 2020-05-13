import { uriToId } from "./helper";

export const PODCAST_ID = "1OLcQdw2PFDPG1jo3s0wbp";
const SPOTIFY_URL = "https://api.spotify.com/v1";

export const fetchSpotify = async ({
  url,
  accessToken,
  method = "GET",
  data = {},
  deviceId,
  queryParams = []
}) => {
  const response = await fetch(
    `${SPOTIFY_URL}${url}${
      deviceId ? "?device_id=" + deviceId : ""
    }${queryParams
      .map(obj => "&" + Object.keys(obj)[0] + "=" + obj[Object.keys(obj)[0]])
      .join("")}`,
    {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      body: method !== "GET" ? JSON.stringify(data) : null
    }
  );
  let json = {};
  if (response.ok && response.status != 204) {
    json = await response.json();
  } else {
    // ERROR
    // TODO: Handle error
  }
  return json;
};

export async function initPlayer(accessToken) {
  // eslint-disable-next-line no-undef
  const player = new Spotify.Player({
    name: "guter podcast",
    getOAuthToken: cb => {
      cb(accessToken);
    }
  });

  await player.connect();
  return player;
}

export async function pause({ accessToken, deviceId }) {
  await fetchSpotify({
    url: "/me/player/pause",
    device_id: deviceId,
    accessToken: accessToken,
    method: "PUT"
  });
}

export async function continueOnDevice({ accessToken, deviceId }) {
  await fetchSpotify({
    url: `/me/player/play`,
    accessToken,
    method: "PUT",
    deviceId,
    data: {}
  });
}

export async function seek({ accessToken, position_ms = 0, deviceId }) {
  await fetchSpotify({
    url: `/me/player/seek`,
    accessToken,
    method: "PUT",
    deviceId,
    queryParams: [{ position_ms }]
  });
}

export async function current({ accessToken }) {
  return await fetchSpotify({
    url: "/me/player",
    accessToken
  });
}

export async function play({
  uris = [],
  accessToken,
  position_ms = 0,
  deviceId
}) {
  await fetchSpotify({
    url: `/me/player/play`,
    accessToken,
    method: "PUT",
    deviceId,
    data: {
      uris,
      position_ms
    }
  });
}

export async function getShow({ uri = "", accessToken, deviceId }) {
  const data = await fetchSpotify({
    url: `/shows/${uri}`,
    accessToken: accessToken,
    deviceId
  });
  return data;
}

export async function getTracks({ uris = [], accessToken, deviceId }) {
  const ids = uris.map(uri => uriToId(uri)).join(",");
  const { tracks } = await fetchSpotify({
    url: `/tracks/?ids=${encodeURI(ids)}`,
    accessToken,
    deviceId
  });
  return tracks;
}
