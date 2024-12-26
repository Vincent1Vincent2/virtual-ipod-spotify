"use server";
import prisma from "@/services/prisma";
import { DBPlaylist } from "@/types/database/playlist";

export const savePlaylistData = async (
  playlistHref: string,
  playlistId: string,
  playlistName: string,
  playlistTracks: number,
  playlistUri: string
): Promise<void> => {
  try {
    // Check if the playlist already exists
    const existingPlaylist = await prisma.playlist.findUnique({
      where: { playlist_id: playlistId },
    });

    if (existingPlaylist) {
      console.log("Playlist already exists. Skipping save.");
      return; // Exit if the playlist is already in the database
    }

    // If not found, create the playlist
    await prisma.playlist.create({
      data: {
        playlist_href: playlistHref,
        playlist_id: playlistId,
        playlist_name: playlistName,
        playlist_tracks: playlistTracks,
        playlist_uri: playlistUri,
      },
    });

    console.log("Playlist saved successfully");
  } catch (error) {
    console.error("Error saving playlist:", error);
    throw new Error("Failed to save playlist");
  }
};

export const getAllPlaylists = async (): Promise<DBPlaylist[]> => {
  try {
    const playlists = await prisma.playlist.findMany();
    return playlists;
  } catch (error) {
    console.error("Error fetching playlists:", error);
    throw new Error("Failed to fetch playlists");
  }
};
