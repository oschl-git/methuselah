const { SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
const { getEmojiByName } = require('../../helpers/emojiManager');
const wisdoms = require(path.join(__dirname, '../../command-data/wisdoms.json'));

module.exports = {
	cooldown: 2,
	data: new SlashCommandBuilder()
		.setName('wisdom')
		.setDescription('Gives you lifechanging wisdoms.')
		.setDMPermission(true),
	async execute(interaction) {
		console.log(`[LOG] @${interaction.user.username} used the /wisdom command.`);

		const message = (
			`${getEmojiByName('methuselah', interaction)} *${getRandomWisdom()}*`
		);
		interaction.reply(message);
	},
};

function getRandomWisdom() {
	return wisdoms[Math.floor(Math.random() * wisdoms.length)];
}