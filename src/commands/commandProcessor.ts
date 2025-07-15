import { Client, Events, Interaction, MessageFlags } from "discord.js";
import * as cooldownManager from "../services/cooldownManager.js";
import CommandNotFoundError from "../errors/CommandNotFoundError.js";
import ErrorEmbed from "../responses/ErrorEmbed.js";
import getCommandIndex from "./commandLoader.js";
import logger from "../services/logger.js";
import CooldownEmbed from "../responses/CooldownEmbed.js";

export async function loadCommands(client: Client): Promise<void> {
  client.on(Events.InteractionCreate, processCommand);
}

async function processCommand(interaction: Interaction): Promise<void> {
  if (!interaction.isChatInputCommand()) return;

  try {
    const command = (await getCommandIndex()).get(interaction.commandName);

    if (!command) {
      throw new CommandNotFoundError(
        "Attempted to execute a command that does not exist",
        interaction.commandName,
      );
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
        `@${interaction.user.username} tried executing /${interaction.commandName} but was on cooldown`,
      );

      return;
    }

    await cooldownManager.setCooldown(
      interaction.commandName,
      interaction.user.id,
    );

    await command.execute(interaction);

    logger.info(
      `@${interaction.user.username} executed /${interaction.commandName}`,
    );
  } catch (error) {
    interaction.reply({
      embeds: [new ErrorEmbed("an error occured while executing command.")],
      flags: [MessageFlags.Ephemeral],
    });

    logger.error(
      `Failed executing /${interaction.commandName} used by @${interaction.user.username}`,
      error,
    );
  }
}
