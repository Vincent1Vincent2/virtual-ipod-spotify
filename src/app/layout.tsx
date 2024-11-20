import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "iPod Spotify",
  description: "Virtual iPod with Spotify serving as it's music library",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
