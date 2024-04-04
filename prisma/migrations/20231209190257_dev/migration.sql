-- CreateTable
CREATE TABLE "RoleExplain" (
    "id" TEXT NOT NULL,
    "guild" TEXT NOT NULL,
    "data" TEXT NOT NULL,

    CONSTRAINT "RoleExplain_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RoleExplain_id_key" ON "RoleExplain"("id");
