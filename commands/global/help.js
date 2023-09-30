const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const fs = require('node:fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Displays information about the bot and its capabilities.')
		.setDMPermission(true),
	async execute(interaction) {
		console.log(`[LOG] @${interaction.user.username} used the /help command.`);

		try {
			const text = fs.readFileSync('command-data/help.md').toString();
			const embed = new EmbedBuilder().setDescription(text);
			interaction.reply({ embeds: [embed], ephemeral: true });
		}
		catch (e) {
			console.error('[CRITICAL] Couldn\'t access help txt file.');
			console.error(e);
			const embed = new EmbedBuilder()
				.setDescription('**✕** error displaying information.')
				.setColor(Colors.Red);
			interaction.reply({ embeds: [embed], ephemeral: true });
			throw e;
		}
	},
};