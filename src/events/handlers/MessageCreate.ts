import { Events, Message, TextChannel } from 'discord.js';
import Event from "./Event.js";

export default class MessageCreate implements Event<Events.MessageCreate> {
  name = Events.MessageCreate as const;
  once = false;

  async execute(message: Message): Promise<void> {
    const channel = message.channel;

    if (!channel.isTextBased) {
      return;
    }

		if (message.author.bot) {
			return;
		}

    await (channel as TextChannel).send(message.content);
  }
}
