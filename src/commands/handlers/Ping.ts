import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./Command.js";
import manifest from "../../../package.json" with { type: "json" };

export default class Ping implements Command {
  data = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("A simple testing command.");

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.reply({
      content: `*Ho, ${interaction.user}! So you're still alive.*\n\`version: ${manifest.version}\``,
    });
  }
}
