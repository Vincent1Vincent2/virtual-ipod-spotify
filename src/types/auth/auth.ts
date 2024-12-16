export interface AuthState {
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;
}
export interface AuthContextType {
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  logout: () => void;
  startAuth: () => void;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}
