import { Events, Message, TextChannel } from "discord.js";
import * as editMessageManager from "../../services/editMessageManager.js";
import assert from "node:assert";
import EventHandler from "./EventHandler.js";
import logger from "../../services/logger.js";

export default class Edit implements EventHandler<Events.MessageCreate> {
  name = Events.MessageCreate as const;
  once = false;

  async execute(message: Message): Promise<void> {
    assert(message.channel instanceof TextChannel);

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
      files: message.attachments.map((attachment) => attachment.url),
    });

    logger.info(
      `User [@${message.author.username}] edited message ${message.id} in channel ${message.channelId}`,
    );
  }
}
