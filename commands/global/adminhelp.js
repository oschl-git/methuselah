const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, Colors } = require('discord.js');
const fs = require('node:fs');

module.exports = {
	cooldown: 1,
	data: new SlashCommandBuilder()
		.setName('adminhelp')
		.setDescription('Displays information about features for administrators.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false),
	async execute(interaction) {
		console.log(`[LOG] @${interaction.user.username} used the /adminhelp command.`);

		try {
			let text = fs.readFileSync('command_config/adminhelp.md').toString();
			let embed = new EmbedBuilder().setDescription(text);
			interaction.reply({ embeds: [embed], ephemeral: true });
		}
		catch (e) {
			console.error('[CRITICAL] Couldn\'t access adminhelp txt file.');
			console.error(e);
			const embed = new EmbedBuilder()
				.setDescription('**✕** error displaying information.')
				.setColor(Colors.Red);
			interaction.reply({ embeds: [embed], ephemeral: true });
			throw e;
		}
	},
};