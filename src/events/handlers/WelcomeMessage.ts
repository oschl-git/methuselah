import { Events, GuildMember } from "discord.js";
import * as emojiLoader from "../../services/emojiLoader.js";
import * as resourceLoader from "../../resources/resourceLoader.js";
import database from "../../data/database.js";
import EventHandler from "./EventHandler.js";
import logger from "../../services/logger.js";
import WelcomeChannel from "../../data/entities/WelcomeChannel.js";

const welcomeQuotes = resourceLoader.loadYaml<string[]>("welcomeQuotes");

export default class WelcomeMessage
  implements EventHandler<Events.GuildMemberAdd>
{
  name = Events.GuildMemberAdd as const;
  once = false;

  async execute(member: GuildMember): Promise<void> {
    if (member.user.bot) {
      return;
    }

    const welcomeChannels = database.getRepository(WelcomeChannel);

    const guildWelcomeChannels = await welcomeChannels.findBy({
      guildId: member.guild.id,
    });

    for (const guildWelcomeChannel of guildWelcomeChannels) {
      const channel = member.guild.channels.cache.get(
        guildWelcomeChannel.channelId,
      );

      if (!channel || !channel.isTextBased()) {
        continue;
      }

      const emoji = await emojiLoader.tryGetEmojiString(
        "methuselah",
        member.guild,
      );

      const quote =
        welcomeQuotes[Math.floor(Math.random() * welcomeQuotes.length)];

      await channel.send(
        `${emoji} *${quote}*\n**${member} just joined the server.**`,
      );

      logger.info(
        `Sent welcome message for [@${member.user.username}] in channel ${guildWelcomeChannel.channelId}`,
      );
    }
  }
}
