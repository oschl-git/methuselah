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

export default class SetReactionRole implements CommandHandler {
  data = new SlashCommandBuilder()
    .setName("setreactionrole")
    .setDescription("Set up a reaction role.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .setContexts(InteractionContextType.Guild)
    .addStringOption((option) =>
      option
        .setName("emoji_name")
        .setDescription("Name of the emoji to use for the reaction")
        .setRequired(true),
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("Role to use for the reaction")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("message_id")
        .setDescription(
          "ID of the message to add the reaction role to (if not specified, the last message will be used)",
        )
        .setRequired(false),
    ) as SlashCommandBuilder;

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const emojiName = interaction.options.getString("emoji_name", true);
    const role = interaction.options.getRole("role", true).id;
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
          await interaction.reply({
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

    const existingReactionRole = await reactionRoles.findOneBy({
      messageId: messageId,
      emoji: emoji,
    });

    if (existingReactionRole !== null) {
      await interaction.reply({
        embeds: [
          new ErrorEmbed("reaction role already exists for this emoji."),
        ],
        flags: [MessageFlags.Ephemeral],
      });

      return;
    }

    const reactionRole = new ReactionRole();
    reactionRole.messageId = messageId;
    reactionRole.emoji = emoji;
    reactionRole.roleId = role;

    await reactionRoles.save(reactionRole);

    const message = await interaction.channel?.messages.fetch(messageId);

    if (!message) {
      interaction.reply({
        embeds: [new ErrorEmbed("message not found.")],
        flags: [MessageFlags.Ephemeral],
      });

      return;
    }

    await message.react(emoji);

    await interaction.reply({
      embeds: [new SuccessEmbed("reaction role set up successfully.")],
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
