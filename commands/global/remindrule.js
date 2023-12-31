const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const path = require('node:path');
const { getEmojiByName } = require('../../helpers/emojiManager');
const rules = require(path.join(__dirname, '../../static-data/rules.json'));

module.exports = {
	cooldown: 1,
	data: new SlashCommandBuilder()
		.setName('remindrule')
		.setDescription('Writes a server rule.')
		.setDMPermission(true)
		.addNumberOption(option =>
			option
				.setName('number')
				.setDescription('Number of the rule.')
				.setRequired(true)),
	async execute(interaction) {
		console.log(`[LOG] @${interaction.user.username} used the /remindrule command.`);

		const number = interaction.options.getNumber('number') ?? null;

		if (number == null) {
			const embed = new EmbedBuilder()
				.setDescription('**✕** no number provided..')
				.setColor(Colors.Red);
			interaction.reply({ embeds: [embed], ephemeral: true });
			return;
		}

		if (!Number.isInteger(number) || number > rules.length || number < 1) {
			const embed = new EmbedBuilder()
				.setDescription('**✕** no such rule.')
				.setColor(Colors.Red);
			interaction.reply({ embeds: [embed], ephemeral: true });
			return;
		}

		const rule = rules[number - 1];

		const message = (`${getEmojiByName('methuselah', interaction)} *Remember rule ${number}:*\n`);

		const embed = new EmbedBuilder().setDescription(rule);

		interaction.reply({ content: message, embeds: [embed] });
	},
};