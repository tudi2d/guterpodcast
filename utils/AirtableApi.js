export async function loadAnnotationsForEpisode(uri = "") {
  let json = {};
  const response = await fetch(`/api/notes?uri=${uri}`, {
    method: "GET"
  });
  if (response.ok && response.status != 204) {
    json = await response.json();
  } else {
    // ERROR
    // TODO: Handle error
  }
  return json;
}
