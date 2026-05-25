import type { Command } from "./types";
import { COMMANDS } from "./commands";


export function getFilteredCommands(query: string): Command[] {
  // if the user not provide any input yet! display all commands available
  if (query.length === 0) return COMMANDS;
  // else filter the commands
  return COMMANDS.filter((cmd) => cmd.name.toLowerCase().startsWith(query.toLowerCase()))
}
