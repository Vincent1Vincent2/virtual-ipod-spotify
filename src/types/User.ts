export interface SpotifyUserProfile {
  display_name: string | null;
  email: string;
  id: string;
  images: Array<{
    url: string;
    height: number | null;
    width: number | null;
  }>;
  followers: {
    total: number;
  };
  country: string;
  product: string;
  uri: string;
}
