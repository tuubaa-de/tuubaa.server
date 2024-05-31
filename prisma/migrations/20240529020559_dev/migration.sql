-- CreateTable
CREATE TABLE "RemberRole" (
    "roleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "guild" TEXT NOT NULL,

    CONSTRAINT "RemberRole_pkey" PRIMARY KEY ("roleId","userId")
);
