import { Events, Message, TextChannel } from "discord.js";
import * as xpManager from "../../services/xpManager.js";
import EventHandler from "./EventHandler.js";

export default class TrackUserInteraction
  implements EventHandler<Events.MessageCreate>
{
  name = Events.MessageCreate as const;
  once = false;

  async execute(message: Message): Promise<void> {
    if (!(message.channel instanceof TextChannel)) {
      return;
    }

    if (message.author.bot) {
      return;
    }

    if (!message.guildId) {
      return;
    }

    const interaction = {
      messageLength: message.content.length,
    };

    await xpManager.trackUserInteraction(
      message.guildId,
      message.author.id,
      message.author.username,
      interaction,
    );
  }
}
