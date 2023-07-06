const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const wisdoms = require(path.join(__dirname, '../../command_config/wisdoms.json'));

module.exports = {
	cooldown: 2,
	data: new SlashCommandBuilder()
		.setName('wisdom')
		.setDescription('Gives you lifechanging wisdoms.')
		.setDMPermission(true),
	async execute(interaction) {
		console.log(`[LOG] @${interaction.user.username} used the /wisdom command.`);

		const message = (
			`${getEmoji('methuselah', interaction)} *${getRandomWisdom()}*`
		);
		interaction.reply(message);
	},
};

function getRandomWisdom() {
	return wisdoms[Math.floor(Math.random() * wisdoms.length)];
}

function getEmoji(name, client) {
	try {
		const id = client.guild.emojis.cache.find(emoji => emoji.name === name).id;
		return `<:${name}:${id}>`;
	}
	catch {
		return '';
	}
}