const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('A simple testing command.')
		.setDMPermission(true),
	async execute(interaction) {
		console.log(`[LOG] @${interaction.user.username} used the /ping command.`);

		interaction.reply(`*Ho, ${interaction.user}! So you're still alive.*`);
	},
};