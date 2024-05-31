-- CreateTable
CREATE TABLE "TicketMessage" (
    "messageId" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TicketMessage_pkey" PRIMARY KEY ("messageId")
);

-- CreateTable
CREATE TABLE "TicketChannel" (
    "channelId" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,

    CONSTRAINT "TicketChannel_pkey" PRIMARY KEY ("channelId")
);

-- CreateIndex
CREATE UNIQUE INDEX "TicketMessage_messageId_key" ON "TicketMessage"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "TicketChannel_channelId_key" ON "TicketChannel"("channelId");
