import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./providers/AuthProvider";
import { PlayerProvider } from "./providers/PlayerProvider";
import { ThemeProvider } from "./providers/ThemeProvider";

export const metadata: Metadata = {
  title: "iPod Spotify",
  description: "Virtual iPod with Spotify serving as it's music library",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <PlayerProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </PlayerProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
