import {
  Client,
  Collection,
  Events,
  Interaction,
  EmbedBuilder,
  Colors,
} from "discord.js";
import Command from "./handlers/Command.js";
import CommandNotFoundError from "../errors/CommandNotFoundError.js";
import logger from '../utils/logger.js';

const commands = new Collection<string, Command>();

export function loadCommands(client: Client): void {
  // @TODO add logic for loading commands from index

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
  } catch (error) {
    const embed = new EmbedBuilder()
      .setDescription("**✕** error executing command.")
      .setColor(Colors.Red);

    interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });

		logger.error(`Failed executing command ${interaction.commandName}`, error);
  }
}
