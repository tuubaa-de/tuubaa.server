import { Module } from "../../types/module";
import { createTicket } from "./commands/create";
import { createTicketModalHandler } from "./events/create";

async function entry() {
  console.log(">> Ticket System loaded");

  createTicketModalHandler();
}

export const ticket = new Module({
  name: "ticket",
  commands: [createTicket],
  entry: entry,
});
