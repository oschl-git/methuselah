const { SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
const { version } = require(path.join(__dirname, '../../package.json'));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('A simple testing command.')
		.setDMPermission(true),
	async execute(interaction) {
		console.log(`[LOG] @${interaction.user.username} used the /ping command.`);

		interaction.reply(`*Ho, ${interaction.user}! So you're still alive.*\n` +
			`\`version: ${version}\``);
	},
};