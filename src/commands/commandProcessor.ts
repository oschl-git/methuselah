import {
  ChatInputCommandInteraction,
  Client,
  Collection,
  Events,
  Interaction,
  SlashCommandBuilder,
} from "discord.js";
import CommandNotFoundError from "../errors/CommandNotFoundError.js";
import logger from "../utils/logger.js";
import ErrorEmbed from "../responses/ErrorEmbed.js";

interface Command {
  data: SlashCommandBuilder;
  execute(interaction: ChatInputCommandInteraction): Promise<void>;
}

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
    interaction.reply({
      embeds: [new ErrorEmbed("an error occured while executing command.")],
      ephemeral: true,
    });

    logger.error(`Failed executing command ${interaction.commandName}`, error);
  }
}
