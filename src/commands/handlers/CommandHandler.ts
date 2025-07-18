import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default interface CommandHandler {
  data: SlashCommandBuilder;
  cooldown?: number;
  execute(interaction: ChatInputCommandInteraction): Promise<void>;
}
