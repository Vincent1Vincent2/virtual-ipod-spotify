export async function getUserPlaylists(
  accessToken: string | null,
  onPlaylistClick: (playlist: any) => void
) {
  if (!accessToken) {
    console.error("No access token provided!");
    return;
  }

  try {
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

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data.items[0].name);
    console.log(data.items[0].uri);
    console.log(data.items[0]);
    // Clear existing content and append playlists
    const content = document.querySelector(".screen");
    if (!content) {
      console.error("Content element not found!");
      return;
    }

    content.innerHTML = ""; // Clear existing content

    data.items.forEach((playlist: any) => {
      const playlistItem = document.createElement("div");
      playlistItem.className = "playlist-item";
      playlistItem.textContent = playlist.name;

      playlistItem.addEventListener("click", () => {
        onPlaylistClick(playlist); // Trigger callback with playlist data
      });

      content.appendChild(playlistItem);
    });
  } catch (error) {
    console.error("Failed to fetch playlists:", error);
  }
}
