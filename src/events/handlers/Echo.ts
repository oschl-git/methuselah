import { Events, Message, TextChannel } from "discord.js";
import * as echoMessageManager from "../../services/echoMessageManager.js";
import assert from "node:assert";
import EventHandler from "./EventHandler.js";
import logger from "../../services/logger.js";

export default class Echo implements EventHandler<Events.MessageCreate> {
  name = Events.MessageCreate as const;
  once = false;

  async execute(message: Message): Promise<void> {
    assert(message.channel instanceof TextChannel);

    if (message.author.bot) {
      return;
    }

    if (
      !echoMessageManager.isAwaitingEchoMessage(
        message.author.id,
        message.channelId,
      )
    ) {
      return;
    }

    echoMessageManager.removeEntry(message.author.id, message.channelId);

    await message.delete();

    await message.channel.send({
      content: message.content,
      files: message.attachments.map((attachment) => attachment.url),
    });

    logger.info(
      `Echoed message from [@${message.author.username}] in channel ${message.channelId}`,
    );
  }
}
