/*
  Warnings:

  - The primary key for the `Config` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropIndex
DROP INDEX "Config_id_key";

-- AlterTable
ALTER TABLE "Config" DROP CONSTRAINT "Config_pkey",
ADD CONSTRAINT "Config_pkey" PRIMARY KEY ("name");
