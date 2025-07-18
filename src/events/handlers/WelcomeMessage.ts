import { Events, GuildMember } from "discord.js";
import * as emojiLoader from "../../services/emojiLoader.js";
import database from "../../data/database.js";
import EventHandler from "./EventHandler.js";
import WelcomeChannel from "../../data/entities/WelcomeChannel.js";
import * as resourceLoader from "../../resources/resourceLoader.js";

const welcomeQuotes = resourceLoader.loadYaml<string[]>("welcomeQuotes");

export default class WelcomeMessage implements EventHandler<Events.GuildMemberAdd> {
  name = Events.GuildMemberAdd as const;
  once = false;

  async execute(member: GuildMember): Promise<void> {
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

      const emoji = emojiLoader.tryGetEmoji("methuselah", member.guild);
      const quote =
        welcomeQuotes[Math.floor(Math.random() * welcomeQuotes.length)];

      channel.send(
        `> ${emoji} *${quote}*\n**${member} just joined the server.**`,
      );
    }
  }
}
