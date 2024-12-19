export interface SpotifyPlaylist {
  href: string;
  id: string;
  name: string;
  tracks: { total: number };
  uri: string;
}
