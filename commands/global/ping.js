const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('A simple testing command.')
		.setDMPermission(true),
	async execute(interaction) {
		await interaction.reply(`*Ho, ${interaction.member}! So you're still alive.*`);
	},
};