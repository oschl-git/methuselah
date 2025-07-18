import {
  ChatInputCommandInteraction,
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import * as editMessageManager from "../../services/editMessageManager.js";
import CommandHandler from "./CommandHandler.js";
import SuccessEmbed from "../../responses/SuccessEmbed.js";
import assert from "node:assert";
import ErrorEmbed from "../../responses/ErrorEmbed.js";

export default class Edit implements CommandHandler {
  data = new SlashCommandBuilder()
    .setName("edit")
    .setDescription("Edit a message written by the bot.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption((option) =>
      option
        .setName("message_id")
        .setDescription("ID of the message to edit")
        .setRequired(true),
    ) as SlashCommandBuilder;

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const messageId = interaction.options.getString("message_id", true);

    try {
      assert(interaction.channel);
      await interaction.channel.messages.fetch(messageId);
    } catch {
      await interaction.reply({
        embeds: [new ErrorEmbed("message not found/invalid ID.")],
        flags: [MessageFlags.Ephemeral],
      });

			return;
    }

    editMessageManager.addEntry(
      interaction.user.id,
      interaction.channelId,
      messageId,
    );

    await interaction.reply({
      embeds: [
        new SuccessEmbed(
          `you have ${editMessageManager.editMessageTimeout} seconds to write new content for the message.`,
        ),
      ],
      flags: [MessageFlags.Ephemeral],
    });
  }
}
