import { Client, Collection, Events, Interaction, MessageFlags } from "discord.js";
import importInstancesFromDirectory from "../services/classLoader.js";
import * as cooldownManager from "../services/cooldownManager.js";
import * as userState from "../services/userState.js";
import CommandNotFoundError from "../errors/CommandNotFoundError.js";
import CooldownEmbed from "../responses/CooldownEmbed.js";
import ErrorEmbed from "../responses/ErrorEmbed.js";
import logger from "../services/logger.js";
import path from "path";
import Command from './handlers/Command.js';

export const commands: Collection<string, Command> = new Collection<string, Command>();

export async function loadCommands(client: Client): Promise<void> {
  const commandModules = await importInstancesFromDirectory<Command>(
    path.join(process.cwd(), "src", "commands", "handlers"),
  );

  for (const module of commandModules) {
    commands.set(module.data.name, module);
  }

  client.on(Events.InteractionCreate, processCommand);
}

async function processCommand(interaction: Interaction): Promise<void> {
  if (!interaction.isChatInputCommand()) return;

  try {
    const command = commands.get(interaction.commandName);

    if (!command) {
      throw new CommandNotFoundError(
        "Attempted to execute a command that does not exist",
        interaction.commandName,
      );
    }

    if (userState.isUserBlocked(interaction.user.id)) {
      interaction.reply({
        embeds: [
          new ErrorEmbed(
            "a pending interaction is blocking you from taking actions.",
          ),
        ],
        flags: [MessageFlags.Ephemeral],
      });

      logger.info(
        `[@${interaction.user.username}] tried executing /${interaction.commandName} but was blocked by a pending ` +
          `interaction`,
      );

      return;
    }

    if (
      await cooldownManager.isOnCooldown(
        interaction.commandName,
        interaction.user.id,
      )
    ) {
      interaction.reply({
        embeds: [new CooldownEmbed(interaction.commandName)],
        flags: [MessageFlags.Ephemeral],
      });

      logger.info(
        `[@${interaction.user.username}] tried executing /${interaction.commandName} but was on cooldown`,
      );

      return;
    }

    await cooldownManager.setCooldown(
      interaction.commandName,
      interaction.user.id,
    );

    await command.execute(interaction);

    logger.info(
      `[@${interaction.user.username}] executed /${interaction.commandName}`,
    );
  } catch (error) {
    interaction.reply({
      embeds: [new ErrorEmbed("an error occured while executing command.")],
      flags: [MessageFlags.Ephemeral],
    });

    logger.error(
      `Failed executing /${interaction.commandName} used by [@${interaction.user.username}]`,
      error,
    );
  }
}
