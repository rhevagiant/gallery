/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - Added the required column `Email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `NamaLengkap` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserID` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Album" (
    "AlbumID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "NamaAlbum" TEXT NOT NULL,
    "Deskripsi" TEXT,
    "TanggalDibuat" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UserID" INTEGER NOT NULL,
    CONSTRAINT "Album_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User" ("UserID") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Foto" (
    "FotoID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "JudulFoto" TEXT NOT NULL,
    "DeskripsiFoto" TEXT,
    "TanggalUnggah" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "LokasiFile" TEXT NOT NULL,
    "AlbumID" INTEGER NOT NULL,
    "UserID" INTEGER NOT NULL,
    CONSTRAINT "Foto_AlbumID_fkey" FOREIGN KEY ("AlbumID") REFERENCES "Album" ("AlbumID") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Foto_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User" ("UserID") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "KomentarFoto" (
    "KomentarID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FotoID" INTEGER NOT NULL,
    "UserID" INTEGER NOT NULL,
    "IsiKomentar" TEXT NOT NULL,
    "TanggalKomentar" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "KomentarFoto_FotoID_fkey" FOREIGN KEY ("FotoID") REFERENCES "Foto" ("FotoID") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "KomentarFoto_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User" ("UserID") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LikeFoto" (
    "LikeID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FotoID" INTEGER NOT NULL,
    "UserID" INTEGER NOT NULL,
    "TanggalLike" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LikeFoto_FotoID_fkey" FOREIGN KEY ("FotoID") REFERENCES "Foto" ("FotoID") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LikeFoto_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User" ("UserID") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "UserID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Username" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "NamaLengkap" TEXT NOT NULL,
    "Alamat" TEXT
);
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_Username_key" ON "User"("Username");
CREATE UNIQUE INDEX "User_Email_key" ON "User"("Email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
