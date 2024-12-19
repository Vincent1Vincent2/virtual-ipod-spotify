export async function getPlaylistTracks(accessToken: string, id: string) {
  if (!accessToken) throw new Error("No access token provided!");

  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${id}/tracks?` +
      new URLSearchParams({
        limit: "50",
        offset: "0",
      }),
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  const data = await response.json();

  return data.items;
}
