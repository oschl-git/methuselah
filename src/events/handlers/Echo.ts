import { Events, Message, TextChannel } from "discord.js";
import { fetchDiscordAttachments } from "../../services/fetchDiscordAttachments.js";
import * as echoMessageManager from "../../services/echoMessageManager.js";
import EventHandler from "./EventHandler.js";
import logger from "../../services/logger.js";

export default class Echo implements EventHandler<Events.MessageCreate> {
  name = Events.MessageCreate as const;
  once = false;

  async execute(message: Message): Promise<void> {
    if (!(message.channel instanceof TextChannel)) {
      return;
    }

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

    const attachments = await fetchDiscordAttachments(
      message.attachments.values(),
    );

    await message.delete();

    await message.channel.send({
      content: message.content,
      files: attachments,
    });

    logger.info(
      `Echoed message from [@${message.author.username}] in channel ${message.channelId}`,
    );
  }
}
