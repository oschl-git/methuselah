import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import * as emojiLoader from "../../services/emojiLoader.js";
import * as resourceLoader from "../../resources/resourceLoader.js";
import Command from "./Command.js";

const wisdoms = resourceLoader.loadYaml<string[]>("wisdoms");

export default class Ping implements Command {
  data = new SlashCommandBuilder()
    .setName("wisdom")
    .setDescription("Displays lifechanging wisdoms.");

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const randomWisdom = wisdoms[Math.floor(Math.random() * wisdoms.length)];

    let emoji = "";
    if (interaction.guild !== null) {
      emoji = emojiLoader.tryGetEmoji("methuselah", interaction.guild) ?? "";
    }

    await interaction.reply({
      content: emoji ? `${emoji} *${randomWisdom}*` : `*${randomWisdom}*`,
    });
  }
}
