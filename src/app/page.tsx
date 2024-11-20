"use client";

import { useEffect, useState } from "react";
import { Token } from "../utils/Token";
import { IPod } from "./Components/iPod/iPod";

export default function Home() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsAuth, setNeedsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      // Check URL for code
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      // Check if we already have a token
      const existingToken = localStorage.getItem("access_token");

      if (existingToken) {
        setAccessToken(existingToken);
        setIsLoading(false);
      } else if (code) {
        // We have a code but no token - need to process auth
        setNeedsAuth(true);
        setIsLoading(false);
      } else {
        // No code, no token - show initial state
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Show loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Show Token component if we need to process authentication
  if (needsAuth) {
    return <Token />;
  }

  // Show iPod with appropriate state
  return (
    <div className="min-h-screen flex items-center justify-center">
      <IPod isDemo={!accessToken} accessToken={accessToken || undefined} />
    </div>
  );
}
