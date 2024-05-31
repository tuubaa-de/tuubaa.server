import { Module } from "../../types/module";
import { createTicket } from "./commands/create";
import { createTicketModalHandler } from "./events/create";
import { onTicketCreate } from "./events/onTicket";
import { ticketHandler } from "./events/ticketHandler";

async function entry() {
  console.log(">> Ticket System loaded");

  createTicketModalHandler();
  onTicketCreate();
  ticketHandler();
}

export const ticket = new Module({
  name: "ticket",
  commands: [createTicket],
  entry: entry,
});
