-- CreateTable
CREATE TABLE "Config" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "Level" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "xp" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "FeatureFlags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "features" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Messages" (
    "messageId" TEXT NOT NULL PRIMARY KEY,
    "message" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Voice" (
    "voiceId" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "private" BOOLEAN NOT NULL,
    "locked" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "VoiceAccess" (
    "voiceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("voiceId", "userId"),
    CONSTRAINT "VoiceAccess_voiceId_fkey" FOREIGN KEY ("voiceId") REFERENCES "Voice" ("voiceId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "UserConfig" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "ping" BOOLEAN NOT NULL,
    "prefix" TEXT NOT NULL,
    "suffix" TEXT NOT NULL,
    "limit" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Keks" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "keks" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Ticket" (
    "messageId" TEXT NOT NULL PRIMARY KEY,
    "channelId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Rules" (
    "message" TEXT NOT NULL PRIMARY KEY,
    "channel" TEXT NOT NULL,
    "guild" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "TicketMessage" (
    "messageId" TEXT NOT NULL PRIMARY KEY,
    "ticketId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "timestamp" INTEGER NOT NULL,
    CONSTRAINT "TicketMessage_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket" ("messageId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TicketChannel" (
    "channelId" TEXT NOT NULL PRIMARY KEY,
    "ticketId" TEXT NOT NULL,
    CONSTRAINT "TicketChannel_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket" ("messageId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RemberRole" (
    "roleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "guild" TEXT NOT NULL,

    PRIMARY KEY ("roleId", "userId")
);

-- CreateTable
CREATE TABLE "RoleExplanation" (
    "guildId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL PRIMARY KEY,
    "channelId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "JoinMessage" (
    "guildId" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_blocked" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_blocked_A_fkey" FOREIGN KEY ("A") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_blocked_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_friends" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_friends_A_fkey" FOREIGN KEY ("A") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_friends_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Config_name_key" ON "Config"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Level_userId_key" ON "Level"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "FeatureFlags_id_key" ON "FeatureFlags"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Messages_messageId_key" ON "Messages"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "Voice_voiceId_key" ON "Voice"("voiceId");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserConfig_userId_key" ON "UserConfig"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Keks_userId_key" ON "Keks"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_messageId_key" ON "Ticket"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "Rules_message_key" ON "Rules"("message");

-- CreateIndex
CREATE UNIQUE INDEX "Rules_guild_key" ON "Rules"("guild");

-- CreateIndex
CREATE UNIQUE INDEX "TicketMessage_messageId_key" ON "TicketMessage"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "TicketChannel_channelId_key" ON "TicketChannel"("channelId");

-- CreateIndex
CREATE UNIQUE INDEX "RoleExplanation_messageId_key" ON "RoleExplanation"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "JoinMessage_guildId_key" ON "JoinMessage"("guildId");

-- CreateIndex
CREATE UNIQUE INDEX "JoinMessage_userId_key" ON "JoinMessage"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_blocked_AB_unique" ON "_blocked"("A", "B");

-- CreateIndex
CREATE INDEX "_blocked_B_index" ON "_blocked"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_friends_AB_unique" ON "_friends"("A", "B");

-- CreateIndex
CREATE INDEX "_friends_B_index" ON "_friends"("B");
