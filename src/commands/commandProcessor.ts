import CommandNotFoundError from "../errors/CommandNotFoundError.js";
import { Client, Collection, Events, Interaction } from "discord.js";
import ErrorEmbed from "../responses/ErrorEmbed.js";
import fs from "fs";
import logger from "../utils/logger.js";
import path from "path";
import yaml from "yaml";
import assert from "assert";
import Command from "./handlers/Command.js";

let commands = new Collection<string, Command>();

export async function loadCommands(client: Client): Promise<void> {
  commands = await parseCommandIndex();
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

async function parseCommandIndex(): Promise<Collection<string, Command>> {
  const commandIndexPath = path.join(
    process.cwd(),
    "src",
    "commands",
    "index.yaml",
  );

  assert(fs.existsSync(commandIndexPath), "Command index file does not exist");

  const commandIndex = yaml.parse(fs.readFileSync(commandIndexPath, "utf8"));

  const commands = new Collection<string, Command>();
  for (const [name, path] of Object.entries(commandIndex)) {
    type CommandConstructor = new (...args: unknown[]) => Command;

    const command = new ((await import(`../../${path}`))
      .default as CommandConstructor)();

    command.data.setName(name);

    commands.set(name, command);
  }

  return commands;
}
