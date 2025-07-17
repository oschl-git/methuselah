import { DiscordAPIError, Events, Message, TextChannel } from "discord.js";
import * as permaMessageManager from "../../services/permaMessageManager.js";
import assert from "node:assert";
import database from "../../data/database.js";
import Event from "./Event.js";
import logger from '../../services/logger.js';
import PermaMessageEntity from "../../data/entities/PermaMessage.js";

export default class PermaMessage implements Event<Events.MessageCreate> {
  name = Events.MessageCreate as const;
  once = false;

  async execute(message: Message): Promise<void> {
    if (
      permaMessageManager.isAwaitingPermaMessage(
        message.author.id,
        message.channelId,
      )
    ) {
      await this.setPermaMessage(message);
    }

    await this.handleExistingPermaMessage(message);
  }

  private async setPermaMessage(message: Message): Promise<void> {
    assert(message.channel instanceof TextChannel);

    permaMessageManager.removeEntry(message.author.id, message.channelId);

    const permaMessages = database.getRepository(PermaMessageEntity);

    const permaMessage = new PermaMessageEntity();
    permaMessage.channelId = message.channelId;
    permaMessage.content = message.content;

    await permaMessages.save(permaMessage);

    message.delete();
  }

  private async handleExistingPermaMessage(message: Message): Promise<void> {
    assert(message.channel instanceof TextChannel);

		if (message.author.bot) {
			return;
		}

    const permaMessages = database.getRepository(PermaMessageEntity);

    const permaMessage = await permaMessages.findOneBy({
      channelId: message.channelId,
    });

    if (permaMessage === null) {
      return;
    }

    if (permaMessage.sentMessageId) {
			try {
				const sentMessage = await message.channel.messages.fetch(
					permaMessage.sentMessageId,
				);
	
				if (sentMessage) {
					await sentMessage.delete();
				}
			} catch (error) {
				if (error instanceof DiscordAPIError) {
					logger.warn(`Failed fetching existing permamessage for channel ${message.channelId} from Discord API`)
				}

				return;
			}
    }

    const sentMessage = await message.channel.send({
      content: permaMessage.content,
    });

		permaMessage.sentMessageId = sentMessage.id;

		await permaMessages.save(permaMessage);
  }
}
