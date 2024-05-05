/*
  Warnings:

  - The primary key for the `Level` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Level` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Level` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Level` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Level_id_key";

-- AlterTable
ALTER TABLE "Level" DROP CONSTRAINT "Level_pkey",
DROP COLUMN "id",
ADD COLUMN     "userId" TEXT NOT NULL,
ADD CONSTRAINT "Level_pkey" PRIMARY KEY ("userId");

-- CreateTable
CREATE TABLE "Messages" (
    "messageId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("messageId")
);

-- CreateTable
CREATE TABLE "Voice" (
    "voiceId" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "private" BOOLEAN NOT NULL,
    "locked" BOOLEAN NOT NULL,

    CONSTRAINT "Voice_pkey" PRIMARY KEY ("voiceId")
);

-- CreateTable
CREATE TABLE "VoiceAccess" (
    "voiceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "VoiceAccess_pkey" PRIMARY KEY ("voiceId","userId")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserConfig" (
    "userId" TEXT NOT NULL,
    "ping" BOOLEAN NOT NULL,
    "prefix" TEXT NOT NULL,
    "limit" INTEGER NOT NULL,

    CONSTRAINT "UserConfig_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "_blocked" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_friends" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Messages_messageId_key" ON "Messages"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "Voice_voiceId_key" ON "Voice"("voiceId");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserConfig_userId_key" ON "UserConfig"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_blocked_AB_unique" ON "_blocked"("A", "B");

-- CreateIndex
CREATE INDEX "_blocked_B_index" ON "_blocked"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_friends_AB_unique" ON "_friends"("A", "B");

-- CreateIndex
CREATE INDEX "_friends_B_index" ON "_friends"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Level_userId_key" ON "Level"("userId");

-- AddForeignKey
ALTER TABLE "VoiceAccess" ADD CONSTRAINT "VoiceAccess_voiceId_fkey" FOREIGN KEY ("voiceId") REFERENCES "Voice"("voiceId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_blocked" ADD CONSTRAINT "_blocked_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_blocked" ADD CONSTRAINT "_blocked_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_friends" ADD CONSTRAINT "_friends_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_friends" ADD CONSTRAINT "_friends_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
