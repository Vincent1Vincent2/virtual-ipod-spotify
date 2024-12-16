-- CreateTable
CREATE TABLE "Playlist" (
    "id" SERIAL NOT NULL,
    "playlist_href" TEXT NOT NULL,
    "playlist_id" TEXT NOT NULL,
    "playlist_name" TEXT NOT NULL,
    "playlist_tracks" INTEGER NOT NULL,
    "playlist_uri" TEXT NOT NULL,

    CONSTRAINT "Playlist_pkey" PRIMARY KEY ("id")
);
