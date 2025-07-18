import { Events, Message, TextChannel } from "discord.js";
import * as echoMessageManager from "../../services/echoMessageManager.js";
import EventHandler from "./EventHandler.js";
import assert from "node:assert";

export default class Echo implements EventHandler<Events.MessageCreate> {
  name = Events.MessageCreate as const;
  once = false;

  async execute(message: Message): Promise<void> {
    assert(message.channel instanceof TextChannel);

    if (
      !echoMessageManager.isAwaitingEchoMessage(
        message.author.id,
        message.channelId,
      )
    ) {
      return;
    }

    echoMessageManager.removeEntry(message.author.id, message.channelId);

    message.delete();

    message.channel.send({
      content: message.content,
      files: message.attachments.map((attachment) => attachment.url),
    });
  }
}
