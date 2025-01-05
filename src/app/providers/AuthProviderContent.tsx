"use client";

import {
  AUTH_CONFIG,
  AUTH_STORAGE_KEYS,
  AuthContextType,
  AuthProviderProps,
  AuthState,
  SpotifyTokenResponse,
} from "@/types/auth/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  logout: () => {},
  startAuth: () => {},
});

export const AuthProviderContent: React.FC<AuthProviderProps> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: true,
    error: null,
    accessToken: null,
  });

  const router = useRouter();
  const searchParams = useSearchParams();

  const checkAndRefreshToken = async (): Promise<string | null> => {
    const expiryTime = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN_EXPIRY);
    const currentTime = Date.now();

    if (!expiryTime) {
      console.log("No expiry time found");
      clearTokens();
      return null;
    }

    console.log("Current time:", new Date(currentTime).toISOString());
    console.log("Expiry time:", new Date(parseInt(expiryTime)).toISOString());

    if (currentTime > parseInt(expiryTime)) {
      console.log("Token expired, clearing tokens");
      clearTokens();
      return null;
    }

    if (
      currentTime + AUTH_CONFIG.TOKEN_REFRESH_THRESHOLD >
      parseInt(expiryTime)
    ) {
      console.log("Token near expiry, attempting refresh");
      return await refreshToken();
    }

    return localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
  };

  const clearTokens = (): void => {
    localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN_EXPIRY);
    setAuthState({
      isLoading: false,
      error: null,
      accessToken: null,
    });
  };

  const refreshToken = async (): Promise<string | null> => {
    try {
      const refresh_token = localStorage.getItem(
        AUTH_STORAGE_KEYS.REFRESH_TOKEN
      );
      if (!refresh_token) {
        throw new Error("No refresh token available");
      }

      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refresh_token,
          client_id: process.env.NEXT_PUBLIC_CLIENT_ID || "",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data: SpotifyTokenResponse = await response.json();
      const expiryTime = Date.now() + AUTH_CONFIG.TOKEN_EXPIRY_TIME;

      localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, data.access_token);
      localStorage.setItem(
        AUTH_STORAGE_KEYS.TOKEN_EXPIRY,
        expiryTime.toString()
      );

      if (data.refresh_token) {
        localStorage.setItem(
          AUTH_STORAGE_KEYS.REFRESH_TOKEN,
          data.refresh_token
        );
      }

      console.log(
        "Token refreshed, new expiry:",
        new Date(expiryTime).toISOString()
      );

      setAuthState({
        isLoading: false,
        error: null,
        accessToken: data.access_token,
      });

      return data.access_token;
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
      return null;
    }
  };

  useEffect(() => {
    const checkToken = async () => {
      const token = await checkAndRefreshToken();
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        accessToken: token,
      }));
    };

    const interval = setInterval(checkToken, 5000); // Check every 5 seconds
    checkToken(); // Initial check

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const code = searchParams.get("code");
        const error = searchParams.get("error");

        if (error) {
          setAuthState({
            isLoading: false,
            error: "Authentication failed. Please try again.",
            accessToken: null,
          });
          return;
        }

        if (code) {
          setAuthState({
            isLoading: true,
            error: null,
            accessToken: null,
          });

          const verifier = localStorage.getItem(
            AUTH_STORAGE_KEYS.CODE_VERIFIER
          );
          if (!verifier) {
            throw new Error("No code verifier found");
          }

          const response = await fetch(
            "https://accounts.spotify.com/api/token",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: new URLSearchParams({
                client_id: process.env.NEXT_PUBLIC_CLIENT_ID || "",
                grant_type: "authorization_code",
                code,
                redirect_uri:
                  process.env.NEXT_REDIRECT_URI || "http://localhost:3000/",
                code_verifier: verifier,
              }),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to exchange code for token");
          }

          const data: SpotifyTokenResponse = await response.json();
          const expiryTime = Date.now() + AUTH_CONFIG.TOKEN_EXPIRY_TIME;

          localStorage.setItem(
            AUTH_STORAGE_KEYS.ACCESS_TOKEN,
            data.access_token
          );
          localStorage.setItem(
            AUTH_STORAGE_KEYS.TOKEN_EXPIRY,
            expiryTime.toString()
          );

          if (data.refresh_token) {
            localStorage.setItem(
              AUTH_STORAGE_KEYS.REFRESH_TOKEN,
              data.refresh_token
            );
          }

          console.log(
            "Initial token set, expiry:",
            new Date(expiryTime).toISOString()
          );

          localStorage.removeItem(AUTH_STORAGE_KEYS.CODE_VERIFIER);

          setAuthState({
            isLoading: false,
            error: null,
            accessToken: data.access_token,
          });

          router.replace("/");
          return;
        }
      } catch (err) {
        console.error("Auth error:", err);
        setAuthState({
          isLoading: false,
          error: "Something went wrong. Please try again.",
          accessToken: null,
        });
      }
    };

    handleAuth();
  }, [searchParams, router]);

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN_EXPIRY);
    setAuthState({
      isLoading: false,
      error: null,
      accessToken: null,
    });
    router.push("/auth");
  };

  const startAuth = () => {
    router.push("/auth");
  };

  const value: AuthContextType = {
    accessToken: authState.accessToken,
    isAuthenticated: !!authState.accessToken,
    isLoading: authState.isLoading,
    error: authState.error,
    logout,
    startAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
