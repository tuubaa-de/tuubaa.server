/*
  Warnings:

  - You are about to drop the `Level` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RoleExplain` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Rules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `YouTube` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ticket` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Level";

-- DropTable
DROP TABLE "RoleExplain";

-- DropTable
DROP TABLE "Rules";

-- DropTable
DROP TABLE "YouTube";

-- DropTable
DROP TABLE "ticket";

-- CreateTable
CREATE TABLE "Config" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Config_id_key" ON "Config"("id");
