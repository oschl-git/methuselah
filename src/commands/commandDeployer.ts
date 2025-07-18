import { APIApplicationCommand, REST, Routes } from "discord.js";
import * as commandProcessor from './commandProcessor.js';
import config from "config";

export async function registerCommands(): Promise<APIApplicationCommand[]> {
  const commands = [];
  
  for (const command of commandProcessor.commands.values()) {
    commands.push(command.data.toJSON());
  }

  const rest = new REST().setToken(config.get<string>("token"));

  return (await rest.put(
    Routes.applicationCommands(config.get<string>("applicationId")),
    {
      body: commands,
    },
  )) as APIApplicationCommand[];
}
