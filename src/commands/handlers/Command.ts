import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default interface Command {
  data: SlashCommandBuilder;
  cooldown?: number;
  execute(interaction: ChatInputCommandInteraction): Promise<void>;
}
