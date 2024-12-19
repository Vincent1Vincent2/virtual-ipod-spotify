import { SpotifyPlaylist } from "@/types/spotify/playlist";
import { savePlaylistData } from "../database/playlist";

export async function getUserPlaylists(
  accessToken: string
): Promise<SpotifyPlaylist[]> {
  if (!accessToken) throw new Error("No access token provided!");

  const response = await fetch(
    "https://api.spotify.com/v1/me/playlists?" +
      new URLSearchParams({
        limit: "10",
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
  await Promise.all(
    data.items.map(async (playlist: SpotifyPlaylist) => {
      await savePlaylistData(
        playlist.href,
        playlist.id,
        playlist.name,
        playlist.tracks.total,
        playlist.uri
      );
    })
  );

  return data.items;
}
