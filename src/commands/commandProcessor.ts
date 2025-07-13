import CommandNotFoundError from "../errors/CommandNotFoundError.js";
import {
  ChatInputCommandInteraction,
  Client,
  Collection,
  Events,
  Interaction,
  SlashCommandBuilder,
} from "discord.js";
import ErrorEmbed from "../responses/ErrorEmbed.js";
import fs from "fs";
import logger from "../utils/logger.js";
import path from "path";
import yaml from "yaml";
import assert from "assert";

interface Command {
  data: SlashCommandBuilder;
  execute(interaction: ChatInputCommandInteraction): Promise<void>;
}

const commands = new Collection<string, Command>();

export async function loadCommands(client: Client): Promise<void> {
  for (const [name, path] of Object.entries(parseCommandIndex())) {
    logger.debug(parseCommandIndex());

    type CommandConstructor = new (...args: unknown[]) => Command;

    const command = new ((await import(`../../${path}`))
      .default as CommandConstructor)();

    command.data.setName(name);

    commands.set(name, command);
  }

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

function parseCommandIndex(): Record<string, string> {
  const commandIndexPath = path.join(
    process.cwd(),
    "src",
    "commands",
    "index.yaml",
  );

  assert(fs.existsSync(commandIndexPath), "Command index file does not exist");

  return yaml.parse(fs.readFileSync(commandIndexPath, "utf8")) as Record<
    string,
    string
  >;
}
