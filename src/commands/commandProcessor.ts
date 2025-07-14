import { Client, Collection, Events, Interaction } from "discord.js";
import Command from "./handlers/Command.js";
import CommandNotFoundError from "../errors/CommandNotFoundError.js";
import ErrorEmbed from "../responses/ErrorEmbed.js";
import logger from "../utils/logger.js";
import loadCommandIndex from "./commandLoader.js";

let commands = new Collection<string, Command>();

export async function loadCommands(client: Client): Promise<void> {
  commands = await loadCommandIndex();
  client.on(Events.InteractionCreate, processCommand);
}

async function processCommand(interaction: Interaction) {
  if (!interaction.isChatInputCommand()) return;

  try {
    const command = commands.get(interaction.commandName);

    if (!command) {
      throw new CommandNotFoundError(
        "Attempted to execute a command that does not exist",
        interaction.commandName,
      );
    }

    await command.execute(interaction);

    logger.info(
      `@${interaction.user.username} executed /${interaction.commandName}`,
    );
  } catch (error) {
    interaction.reply({
      embeds: [new ErrorEmbed("an error occured while executing command.")],
      ephemeral: true,
    });

    logger.error(
      `Failed executing /${interaction.commandName} used by @${interaction.user.username}`,
      error,
    );
  }
}