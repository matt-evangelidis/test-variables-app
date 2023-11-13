/*
  Warnings:

  - You are about to drop the column `picture` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "picture",
ADD COLUMN     "pictureKey" TEXT;

-- CreateTable
CREATE TABLE "UploadedImage" (
    "key" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "size" INTEGER NOT NULL,

    CONSTRAINT "UploadedImage_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "UploadedImage_key_key" ON "UploadedImage"("key");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_pictureKey_fkey" FOREIGN KEY ("pictureKey") REFERENCES "UploadedImage"("key") ON DELETE SET NULL ON UPDATE CASCADE;
