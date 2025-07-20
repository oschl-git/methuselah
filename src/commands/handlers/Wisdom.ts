import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import * as emojiLoader from "../../services/emojiLoader.js";
import * as resourceLoader from "../../resources/resourceLoader.js";
import CommandHandler from "./CommandHandler.js";

const wisdoms = resourceLoader.loadYaml<string[]>("wisdoms");

export default class Wisdom implements CommandHandler {
  data = new SlashCommandBuilder()
    .setName("wisdom")
    .setDescription("Presents lifechanging wisdoms.");

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const wisdom = wisdoms[Math.floor(Math.random() * wisdoms.length)];

    const emoji = await emojiLoader.tryGetEmojiString(
      "methuselah",
      interaction.guild ?? undefined,
    );

    await interaction.reply({
      content: emoji ? `${emoji} *${wisdom}*` : `*${wisdom}*`,
    });
  }
}
