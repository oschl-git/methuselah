import { Events, Message, TextChannel } from "discord.js";
import * as echoMessageManager from "../../services/echoMessageManager.js";
import Event from "./Event.js";

export default class Echo implements Event<Events.MessageCreate> {
  name = Events.MessageCreate as const;
  once = false;

  async execute(message: Message): Promise<void> {    
		if (!(message.channel instanceof TextChannel)) {
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

		message.delete();

    message.channel.send({
			content: message.content,
			files: message.attachments.map((attachment) => attachment.url),
		})
  }
}
