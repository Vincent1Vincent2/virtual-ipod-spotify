export function dynamicScreen(
  items: any
  /*   onPlaylistClick?: (playlist: any) => void
   */
) {
  // Clear existing content and append playlists
  const content = document.querySelector(".screen");
  if (!content) {
    console.error("Content element not found!");
    return;
  }

  content.innerHTML = ""; // Clear existing content

  items.forEach((playlist: any) => {
    console.log(playlist);

    const playlistItem = document.createElement("div");
    playlistItem.className = "playlist-item";
    playlistItem.textContent = playlist.playlist_name;

    /*     playlistItem.addEventListener("click", () => {
      onPlaylistClick(playlist); // Trigger callback with playlist data
    });
 */
    content.appendChild(playlistItem);
  });
}
