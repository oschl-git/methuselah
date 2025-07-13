import { ChatInputCommandInteraction } from 'discord.js';
import CommandHandler from './CommandHandler.js';

export default class Ping implements CommandHandler {
	async invoke(interaction: ChatInputCommandInteraction): Promise<void> {
		await interaction.reply('Pong!');
	}
}