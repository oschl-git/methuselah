import { Events, Message, TextChannel } from "discord.js";
import * as editMessageManager from "../../services/editMessageManager.js";
import EventHandler from "./EventHandler.js";
import logger from "../../services/logger.js";
import { fetchDiscordAttachments } from "../../services/fetchDiscordAttachments.js";

export default class Edit implements EventHandler<Events.MessageCreate> {
  name = Events.MessageCreate as const;
  once = false;

  async execute(message: Message): Promise<void> {
    if (!(message.channel instanceof TextChannel)) {
      return;
    }

    if (message.author.bot) {
      return;
    }

    const messageId = editMessageManager.getMessageIdForEdit(
      message.author.id,
      message.channelId,
    );

    if (!messageId) {
      return;
    }

    editMessageManager.removeEntry(
      message.author.id,
      message.channelId,
      messageId,
    );

    const attachments = await fetchDiscordAttachments(
      message.attachments.values(),
    );

    await message.delete();

    let originalMessage;
    try {
      originalMessage = await message.channel.messages.fetch(messageId);
    } catch {
      logger.warn(
        `Failed to fetch message for edit with ID ${messageId}, it was probably deleted`,
      );
      return;
    }

    await originalMessage.edit({
      content: message.content,
      files: attachments,
    });

    logger.info(
      `User [@${message.author.username}] edited message ${message.id} in channel ${message.channelId}`,
    );
  }
}
