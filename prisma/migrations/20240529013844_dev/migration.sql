/*
  Warnings:

  - Changed the type of `timestamp` on the `TicketMessage` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "TicketMessage" DROP COLUMN "timestamp",
ADD COLUMN     "timestamp" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "TicketMessage" ADD CONSTRAINT "TicketMessage_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("messageId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketChannel" ADD CONSTRAINT "TicketChannel_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("messageId") ON DELETE RESTRICT ON UPDATE CASCADE;
