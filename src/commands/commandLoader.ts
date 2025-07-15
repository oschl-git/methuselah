import { Collection } from 'discord.js';
import Command from './handlers/Command.js';
import path from 'path';
import assert from 'assert';
import fs from 'fs';
import yaml from 'yaml';

let commands: Collection<string, Command>|null = null;

export default async function loadCommandIndex(): Promise<Collection<string, Command>> {
  if (commands !== null) {
    return commands;
  }

  const commandIndexPath = path.join(
    process.cwd(),
    "src",
    "commands",
    "index.yaml",
  );

  assert(fs.existsSync(commandIndexPath), "Command index file does not exist");

  const commandIndex = yaml.parse(
    fs.readFileSync(commandIndexPath, "utf8"),
  ) as string[];

  commands = new Collection<string, Command>();
  for (const filename of commandIndex) {
    const filePath = path.join(
      process.cwd(),
      "src",
      "commands",
      "handlers",
      filename,
    );

    type CommandConstructor = new (...args: unknown[]) => Command;

    const command = new ((await import(filePath))
      .default as CommandConstructor)();

    commands.set(command.data.name, command);
  }

  return commands;
}
