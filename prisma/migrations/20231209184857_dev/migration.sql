-- CreateTable
CREATE TABLE "ticket" (
    "id" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "claim" TEXT,
    "opened" TEXT NOT NULL,
    "closed" TEXT,

    CONSTRAINT "ticket_pkey" PRIMARY KEY ("id")
);
