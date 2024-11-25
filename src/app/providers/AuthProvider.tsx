// providers/AuthProvider.tsx
"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { createContext, useEffect, useState } from "react";

interface AuthState {
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  logout: () => {},
  startAuth: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: true,
    error: null,
    accessToken: null,
  });

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Check for code and handle auth
  useEffect(() => {
    const handleAuth = async () => {
      try {
        const code = searchParams.get("code");
        const error = searchParams.get("error");
        const existingToken = localStorage.getItem("access_token");

        // Handle auth errors
        if (error) {
          setAuthState({
            isLoading: false,
            error: "Authentication failed. Please try again.",
            accessToken: null,
          });
          return;
        }

        // Already have token
        if (existingToken) {
          setAuthState({
            isLoading: false,
            error: null,
            accessToken: existingToken,
          });
          return;
        }

        // Have code but no token - need to process auth
        if (code) {
          setAuthState({
            isLoading: true,
            error: null,
            accessToken: null,
          });

          // Get PKCE verifier from storage
          const verifier = localStorage.getItem("code_verifier");
          if (!verifier) {
            throw new Error("No code verifier found");
          }

          // Exchange code for token
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
                redirect_uri: "http://localhost:3000/",
                code_verifier: verifier,
              }),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to exchange code for token");
          }

          const data = await response.json();

          // Save tokens
          localStorage.setItem("access_token", data.access_token);
          if (data.refresh_token) {
            localStorage.setItem("refresh_token", data.refresh_token);
          }

          // Clean up
          localStorage.removeItem("code_verifier");

          // Update state
          setAuthState({
            isLoading: false,
            error: null,
            accessToken: data.access_token,
          });

          // Clean URL
          router.replace("/");
          return;
        }

        // No code, no token - initial state
        setAuthState({
          isLoading: false,
          error: null,
          accessToken: null,
        });
      } catch (err) {
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
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setAuthState({
      isLoading: false,
      error: null,
      accessToken: null,
    });
    router.push("/");
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
}

// types/auth/auth.ts
export interface AuthContextType {
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  logout: () => void;
  startAuth: () => void;
}
