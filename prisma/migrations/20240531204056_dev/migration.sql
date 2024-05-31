/*
  Warnings:

  - The primary key for the `RoleExplanation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `message` on the `RoleExplanation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[messageId]` on the table `RoleExplanation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `channelId` to the `RoleExplanation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `messageId` to the `RoleExplanation` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "RoleExplanation_guildId_key";

-- DropIndex
DROP INDEX "RoleExplanation_message_key";

-- AlterTable
ALTER TABLE "RoleExplanation" DROP CONSTRAINT "RoleExplanation_pkey",
DROP COLUMN "message",
ADD COLUMN     "channelId" TEXT NOT NULL,
ADD COLUMN     "messageId" TEXT NOT NULL,
ADD CONSTRAINT "RoleExplanation_pkey" PRIMARY KEY ("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "RoleExplanation_messageId_key" ON "RoleExplanation"("messageId");
