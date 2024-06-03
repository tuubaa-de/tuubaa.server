-- CreateTable
CREATE TABLE "Warnings"
(
    "userId" TEXT    NOT NULL,
    "guild"  TEXT    NOT NULL,
    "count"  INTEGER NOT NULL,

    CONSTRAINT "Warnings_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Warnings_userId_key" ON "Warnings" ("userId");
