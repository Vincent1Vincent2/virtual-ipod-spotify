"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const SPOTIFY_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID || "",
  redirectUri: "http://localhost:3000/",
  scope:
    "user-read-private user-read-email user-read-playback-state user-modify-playback-state user-read-currently-playing app-remote-control streaming playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-follow-modify user-follow-read user-read-playback-position user-top-read user-read-recently-played user-library-modify user-library-read",
  authUrl: "https://accounts.spotify.com/authorize",
  tokenUrl: "https://accounts.spotify.com/api/token",
};

function SpotifyAuth() {
  const [error, setError] = useState("");
  const [status, setStatus] = useState("initializing");

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        if (code) {
          setStatus("exchanging code for token");
          await getToken(code);
          return;
        }

        setStatus("starting auth flow");
        const length = 128;
        const possible =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        const array = window.crypto.getRandomValues(new Uint8Array(length));
        const codeVerifier = Array.from(array)
          .map((x) => possible[x % possible.length])
          .join("");

        const encoder = new TextEncoder();
        const data = encoder.encode(codeVerifier);
        const hashed = await window.crypto.subtle.digest("SHA-256", data);
        const str = String.fromCharCode(...new Uint8Array(hashed));
        const challenge = btoa(str)
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=/g, "");

        window.localStorage.setItem("code_verifier", codeVerifier);

        const authUrl = new URL(SPOTIFY_CONFIG.authUrl);
        const params = {
          response_type: "code",
          client_id: SPOTIFY_CONFIG.clientId,
          scope: SPOTIFY_CONFIG.scope,
          code_challenge_method: "S256",
          code_challenge: challenge,
          redirect_uri: SPOTIFY_CONFIG.redirectUri,
        };

        authUrl.search = new URLSearchParams(params).toString();
        window.location.href = authUrl.toString();
      } catch (err) {
        console.error("Auth flow error:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
        setStatus("error");
      }
    };

    handleAuth();
  }, []);

  const getToken = async (code: string) => {
    try {
      const codeVerifier = localStorage.getItem("code_verifier");

      if (!codeVerifier) {
        throw new Error("No code verifier found in localStorage");
      }

      const requestBody = new URLSearchParams({
        client_id: SPOTIFY_CONFIG.clientId,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: SPOTIFY_CONFIG.redirectUri,
        code_verifier: codeVerifier,
      });

      const response = await fetch(SPOTIFY_CONFIG.tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: requestBody,
      });

      const data = await response.json();

      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        if (data.refresh_token) {
          localStorage.setItem("refresh_token", data.refresh_token);
        }

        localStorage.removeItem("code_verifier");

        window.history.replaceState({}, document.title, "/");
        window.location.reload();
      } else {
        throw new Error("Token exchange failed");
      }
    } catch (err) {
      console.error("Token exchange error:", err);
      setError(err instanceof Error ? err.message : "Failed to get token");
      setStatus("error");
    }
  };

  return (
    <div suppressHydrationWarning className="text-center p-4">
      {error ? (
        <div className="text-red-500">
          <p>Error: {error}</p>
          <p className="mt-2 text-sm text-gray-600">Status: {status}</p>
          <button
            onClick={() => {
              localStorage.removeItem("code_verifier");
              window.location.href = "/";
            }}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Start Over
          </button>
        </div>
      ) : (
        <div>
          <p>Status: {status}</p>
          <p className="mt-2">Please wait...</p>
        </div>
      )}
    </div>
  );
}

export const Token = dynamic(() => Promise.resolve(SpotifyAuth), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});
