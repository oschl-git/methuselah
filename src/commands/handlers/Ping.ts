import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import Command from './Command.js';

export default class Ping implements Command {
	data = new SlashCommandBuilder()
		.setDescription('Replies with Pong!');
	async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		await interaction.reply('Pong!');
	}
}