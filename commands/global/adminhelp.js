const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('node:fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('adminhelp')
		.setDescription('Displays information about features for administrators.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false),
	async execute(interaction) {
		console.log(`[LOG] @${interaction.user.username} used the /adminhelp command.`);

		let text;

		try {
			text = fs.readFileSync('command_config/adminhelp.txt').toString();
			interaction.reply({ content: text, ephemeral: true });
		}
		catch (e) {
			interaction.reply({ content: 'Error displaying information.', ephemeral: true });
			console.error('[CRITICAL] Couldn\'t access adminhelp txt file.');
			console.error(e);
			throw e;
		}
	},
};