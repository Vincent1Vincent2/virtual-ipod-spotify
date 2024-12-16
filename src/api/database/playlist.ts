import prisma from "@/services/prisma";

export const savePlaylistData = async (
  playlistUri: string,
  playlistName: string
): Promise<void> => {
  try {
    await prisma.playlist.create({
      data: {
        playlist_uri: playlistUri,
        playlist_name: playlistName,
      },
    });
    console.log("Playlist saved successfully");
  } catch (error) {
    console.error("Error saving playlist:", error);
    throw new Error("Failed to save playlist");
  }
};

export const getAllPlaylists = async (): Promise<
  { id: number; playlist_uri: string; playlist_name: string }[]
> => {
  try {
    const playlists = await prisma.playlist.findMany();
    return playlists;
  } catch (error) {
    console.error("Error fetching playlists:", error);
    throw new Error("Failed to fetch playlists");
  }
};
