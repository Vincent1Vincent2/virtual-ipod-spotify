export interface SpotifyConfig {
  clientId: string;
  redirectUri: string;
  scope: string;
  authUrl: string;
  tokenUrl: string;
}

// Response from Spotify token endpoint
export interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token?: string;
}

// State management for authentication
export interface AuthState {
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;
}

// Context type for auth provider
export interface AuthContextType {
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  logout: () => void;
  startAuth: () => void;
}

// Props for the auth provider component
export interface AuthProviderProps {
  children: React.ReactNode;
}

// Auth URL parameters
export interface SpotifyAuthParams {
  response_type: "code";
  client_id: string;
  scope: string;
  code_challenge_method: "S256";
  code_challenge: string;
  redirect_uri: string;
}

// Token exchange parameters
export interface TokenExchangeParams {
  client_id: string;
  grant_type: "authorization_code" | "refresh_token";
  code?: string;
  refresh_token?: string;
  redirect_uri?: string;
  code_verifier?: string;
}

// Storage keys for consistent usage across components
export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  TOKEN_EXPIRY: "token_expiry",
  CODE_VERIFIER: "code_verifier",
} as const;

// Configuration constants
export const AUTH_CONFIG = {
  TOKEN_REFRESH_THRESHOLD: 10 * 1000, // 10 seconds before expiry
  TOKEN_EXPIRY_TIME: 50 * 60 * 1000, // 50 minutes
  CODE_VERIFIER_LENGTH: 128,
} as const;
