import {
  ChatInputCommandInteraction,
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import * as permaMessageManager from "../../services/permaMessageManager.js";
import CommandHandler from "./CommandHandler.js";
import database from "../../data/database.js";
import SuccessEmbed from "../../responses/SuccessEmbed.js";
import PermaMessage from "../../data/entities/PermaMessage.js";
import ErrorEmbed from "../../responses/ErrorEmbed.js";

export default class SetPermaMessage implements CommandHandler {
  data = new SlashCommandBuilder()
    .setName("setpermamessage")
    .setDescription("Enable or disable permamessage in this channel.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addBooleanOption((option) =>
      option
        .setName("enabled")
        .setDescription("Turn permamessage on or off")
        .setRequired(false),
    ) as SlashCommandBuilder;

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (interaction.options.getBoolean("enabled", false) === false) {
      await this.disablePermaMessage(interaction);
    } else {
      await this.enablePermaMessage(interaction);
    }
  }

  private async enablePermaMessage(
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    permaMessageManager.addEntry(interaction.user.id, interaction.channelId);

    await interaction.reply({
      embeds: [
        new SuccessEmbed(
          `you have ${permaMessageManager.awaitingPermaMessageTimeout} seconds to write your message.`,
        ),
      ],
      flags: [MessageFlags.Ephemeral],
    });
  }

  private async disablePermaMessage(
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    const permaMessages = database.getRepository(PermaMessage);

    const permaMessage = await permaMessages.findOneBy({
      channelId: interaction.channelId,
    });

    if (permaMessage === null) {
      await interaction.reply({
        embeds: [new ErrorEmbed("this channel does not have a permamessage.")],
        flags: [MessageFlags.Ephemeral],
      });

      return;
    }

    await permaMessages.remove(permaMessage);

    await interaction.reply({
      embeds: [new SuccessEmbed("permamessage has been disabled.")],
      flags: [MessageFlags.Ephemeral],
    });
  }
}
