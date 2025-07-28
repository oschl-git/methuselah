import {
  ChatInputCommandInteraction,
  InteractionContextType,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import * as levelCalculator from "../../services/levelCalculator.js";
import CommandHandler from "./CommandHandler.js";
import database from "../../data/database.js";
import ErrorEmbed from "../../responses/ErrorEmbed.js";
import InfoEmbed from "../../responses/InfoEmbed.js";
import UserXp from "../../data/entities/UserXp.js";

export default class Level implements CommandHandler {
  data = new SlashCommandBuilder()
    .setName("level")
    .setDescription("Shows your current level, xp and progress.")
    .setContexts(InteractionContextType.Guild);

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.guildId) {
      interaction.reply({
        embeds: [new ErrorEmbed("this command can only be used in a server.")],
        flags: [MessageFlags.Ephemeral],
      });

      return;
    }

    const userXp = database.getRepository(UserXp);

    let userXpEntry = await userXp.findOneBy({
      userId: interaction.user.id,
      guildId: interaction.guildId,
    });

    if (!userXpEntry) {
      userXpEntry = new UserXp();

      userXpEntry.userId = interaction.user.id;
      userXpEntry.guildId = interaction.guildId;
      userXpEntry.xp = 0;
      userXpEntry.messageCount = 0;
    }

    const level = levelCalculator.calculateLevel(userXpEntry.xp);
    const xpNeededForNextLevel =
      levelCalculator.getTotalXpForLevel(level + 1) - userXpEntry.xp;

    const content =
      "**Your Level Information**\n" +
      `**Level:** ${level}\n` +
      `**XP:** ${userXpEntry.xp}\n` +
      `**XP needed to level up:** ${xpNeededForNextLevel}\n`;

    interaction.reply({
      embeds: [new InfoEmbed(content)],
    });
  }
}
