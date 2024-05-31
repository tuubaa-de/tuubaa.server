-- CreateTable
CREATE TABLE "RoleExplanation" (
    "guildId" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "RoleExplanation_pkey" PRIMARY KEY ("guildId")
);

-- CreateTable
CREATE TABLE "JoinMessage" (
    "guildId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "JoinMessage_pkey" PRIMARY KEY ("guildId")
);

-- CreateIndex
CREATE UNIQUE INDEX "RoleExplanation_guildId_key" ON "RoleExplanation"("guildId");

-- CreateIndex
CREATE UNIQUE INDEX "RoleExplanation_message_key" ON "RoleExplanation"("message");

-- CreateIndex
CREATE UNIQUE INDEX "JoinMessage_guildId_key" ON "JoinMessage"("guildId");

-- CreateIndex
CREATE UNIQUE INDEX "JoinMessage_userId_key" ON "JoinMessage"("userId");
