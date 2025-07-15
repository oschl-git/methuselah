import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default interface Command {
  data: SlashCommandBuilder;
  execute(interaction: ChatInputCommandInteraction): Promise<void>;
}
