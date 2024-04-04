/*
  Warnings:

  - You are about to drop the column `data` on the `RoleExplain` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[guild]` on the table `RoleExplain` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "RoleExplain" DROP COLUMN "data";

-- CreateTable
CREATE TABLE "YouTube" (
    "id" TEXT NOT NULL,

    CONSTRAINT "YouTube_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RoleExplain_guild_key" ON "RoleExplain"("guild");
