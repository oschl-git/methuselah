import { Collection } from "discord.js";
import * as commandProcessor from "../commands/commandProcessor.js";

const defaultCooldown = 5;

const cooldowns = new Collection<string, Collection<string, number>>();

export async function isOnCooldown(
  commandName: string,
  userId: string,
): Promise<boolean> {
  const commandCooldowns = cooldowns.get(commandName);
  if (!commandCooldowns) {
    return false;
  }

  const lastUsed = commandCooldowns.get(userId);
  if (!lastUsed) {
    return false;
  }

  return (
    Date.now() - lastUsed <
    (commandProcessor.commands.get(commandName)?.cooldown ?? defaultCooldown) *
      1000
  );
}

export async function setCooldown(
  commandName: string,
  userId: string,
): Promise<void> {
  const commandCooldowns =
    cooldowns.get(commandName) || new Collection<string, number>();

  commandCooldowns.set(userId, Date.now());
  cooldowns.set(commandName, commandCooldowns);

  setTimeout(
    () => commandCooldowns.delete(userId),
    (commandProcessor.commands.get(commandName)?.cooldown ?? defaultCooldown) *
      1000,
  );
}
