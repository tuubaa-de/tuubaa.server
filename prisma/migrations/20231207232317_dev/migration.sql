-- CreateTable
CREATE TABLE "Level" (
    "user" TEXT NOT NULL,
    "xp" INTEGER NOT NULL,
    "lvl" INTEGER NOT NULL,
    "guild" TEXT NOT NULL,

    CONSTRAINT "Level_pkey" PRIMARY KEY ("user")
);

-- CreateTable
CREATE TABLE "Rules" (
    "message" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "guild" TEXT NOT NULL,

    CONSTRAINT "Rules_pkey" PRIMARY KEY ("message")
);

-- CreateIndex
CREATE UNIQUE INDEX "Level_user_key" ON "Level"("user");

-- CreateIndex
CREATE UNIQUE INDEX "Rules_message_key" ON "Rules"("message");

-- CreateIndex
CREATE UNIQUE INDEX "Rules_guild_key" ON "Rules"("guild");
