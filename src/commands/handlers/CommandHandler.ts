import { ChatInputCommandInteraction } from 'discord.js';

export default interface Command {
	invoke(interaction: ChatInputCommandInteraction): Promise<void>;
}