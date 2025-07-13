import { Colors, EmbedBuilder } from 'discord.js';

export default class ErrorEmbed extends EmbedBuilder {
	constructor(description: string) {
		super();
		
		this.setDescription(`**✕** ${description}`);
		this.setColor(Colors.Red);
	}
}