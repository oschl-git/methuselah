import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./Command.js";
import manifest from "../../../package.json" with { type: "json" };

export default class Ping implements Command {
  data = new SlashCommandBuilder().setDescription("Replies with Pong!");
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.reply({
      content: `*Ho, ${interaction.user}! So you're still alive.*\n\`version: ${manifest.version}\``,
      ephemeral: true,
    });
  }
}
