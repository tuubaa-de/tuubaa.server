-- CreateTable
CREATE TABLE "Keks" (
    "userId" TEXT NOT NULL,
    "keks" INTEGER NOT NULL,

    CONSTRAINT "Keks_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Keks_userId_key" ON "Keks"("userId");
