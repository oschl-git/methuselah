const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Displays information about the bot and its capabilities.')
		.setDMPermission(true),
	async execute(interaction) {
		let text;

		try {
			text = fs.readFileSync('command_config/help.txt').toString();
			interaction.reply({ content: text, ephemeral: true });
		}
		catch (e) {
			interaction.reply({ content: 'Error displaying information.', ephemeral: true });
			console.error('[CRITICAL] Couldn\'t access help txt file.');
			console.error(e);
			throw e;
		}
	},
};