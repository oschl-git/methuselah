import { APIApplicationCommand, REST, Routes } from "discord.js";
import config from "config";
import loadCommandIndex from "./commandLoader.js";

export async function registerCommands(): Promise<APIApplicationCommand[]> {
  const commandIndex = await loadCommandIndex();

  const commands = [];
  for (const command of commandIndex.values()) {
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
