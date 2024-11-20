"use client";

import { SpotifyUserProfile } from "@/types/User";
import { useEffect, useState } from "react";

interface iPodProps {
  isDemo?: boolean;
  accessToken?: string;
}

export function IPod({ isDemo, accessToken }: iPodProps) {
  const [userProfile, setUserProfile] = useState<SpotifyUserProfile | null>(
    null
  );
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!accessToken) return;

      try {
        const response = await fetch("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch user profile: ${response.statusText}`
          );
        }

        const data = await response.json();
        setUserProfile(data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load user profile"
        );
      }
    };

    if (accessToken) {
      fetchUserProfile();
    }
  }, [accessToken]);

  if (isDemo) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-2xl mb-4">Spotify iPod</h1>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          onClick={() => (window.location.href = "/auth")}
        >
          Connect with Spotify
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Connected iPod</h1>

      {error ? (
        <div className="text-red-500 mb-4">{error}</div>
      ) : userProfile ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            {userProfile.images?.[0] && (
              <img
                src={userProfile.images[0].url}
                alt={userProfile.display_name || "Profile"}
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <h2 className="text-xl font-semibold">
                {userProfile.display_name || "Spotify User"}
              </h2>
              <p className="text-gray-500">{userProfile.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-gray-500">Followers</p>
              <p className="font-medium">{userProfile.followers.total}</p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-gray-500">Country</p>
              <p className="font-medium">{userProfile.country}</p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-gray-500">Account</p>
              <p className="font-medium capitalize">{userProfile.product}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-pulse space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-3 bg-gray-200 rounded w-48"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
