/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Config` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Config_name_key" ON "Config"("name");
