import {
  ChatInputCommandInteraction,
  InteractionContextType,
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import * as emojiLoader from "../../services/emojiLoader.js";
import assert from "node:assert";
import CommandHandler from "./CommandHandler.js";
import database from "../../data/database.js";
import EmojiNotFoundError from "../../errors/EmojiNotFoundError.js";
import ErrorEmbed from "../../responses/ErrorEmbed.js";
import SuccessEmbed from "../../responses/SuccessEmbed.js";
import unicodeEmojiConvertor from "../../services/unicodeEmojiConvertor.js";
import ReactionRole from "../../data/entities/ReactionRole.js";
import WarningEmbed from "../../responses/WarningEmbed.js";

export default class DeleteReactionRole implements CommandHandler {
  data = new SlashCommandBuilder()
    .setName("deletereactionrole")
    .setDescription("Delete a reaction role.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .setContexts(InteractionContextType.Guild)
    .addStringOption((option) =>
      option
        .setName("emoji_name")
        .setDescription("Name of the emoji to remove the reaction role for")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("message_id")
        .setDescription(
          "ID of the message to remove the reaction role from (if not specified, the last message will be used)",
        )
        .setRequired(false),
    ) as SlashCommandBuilder;

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const emojiName = interaction.options.getString("emoji_name", true);
    const messageId =
      interaction.options.getString("message_id", false) ??
      (await this.getIdOfLastMessage(interaction));

    let emoji;
    try {
      emoji = await emojiLoader.getEmojiId(emojiName);
    } catch (error) {
      if (error instanceof EmojiNotFoundError) {
        emoji = unicodeEmojiConvertor.replace_colons(`:${emojiName}:`);

        if (emoji === `:${emojiName}:`) {
          interaction.reply({
            embeds: [
              new ErrorEmbed(
                `emoji not found, make sure you input the emoji name and not the emoji object.`,
              ),
            ],
            flags: [MessageFlags.Ephemeral],
          });

          return;
        }
      } else {
        throw error;
      }
    }

    const reactionRoles = database.getRepository(ReactionRole);

    const reactionRole = await reactionRoles.findOneBy({
      messageId: messageId,
      emoji: emoji,
    });

    if (reactionRole === null) {
      await interaction.reply({
        embeds: [
          new ErrorEmbed(
            "reaction role on this message does not exist for this emoji.",
          ),
        ],
        flags: [MessageFlags.Ephemeral],
      });

      return;
    }

    await reactionRoles.remove(reactionRole);

    const message = await interaction.channel?.messages.fetch(messageId);

    if (!message) {
      await interaction.reply({
        embeds: [
          new WarningEmbed(
            "removed from database, but message could not be found.",
          ),
        ],
        flags: [MessageFlags.Ephemeral],
      });

      return;
    }

    await message.reactions.cache.get(emoji)?.remove();

    interaction.reply({
      embeds: [new SuccessEmbed("reaction role removed.")],
      flags: [MessageFlags.Ephemeral],
    });
  }

  private async getIdOfLastMessage(
    interaction: ChatInputCommandInteraction,
  ): Promise<string> {
    assert(interaction.channel, "Interaction must be in a channel context");

    const messages = await interaction.channel.messages.fetch({ limit: 1 });
    const lastMessage = messages.first();

    assert(lastMessage, "Last message not found in the channel");

    return lastMessage.id;
  }
}
