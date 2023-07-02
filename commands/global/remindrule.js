const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const rules = require(path.join(__dirname, '../../command_config/rules.json'));

module.exports = {
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
		const number = interaction.options.getNumber('number') ?? null;

		if (number == null) {
			await interaction.reply({ content: 'No number provided.', ephemeral: true });
			return;
		}

		if (number > rules.length || number < 1) {
			await interaction.reply({ content: 'No such rule.', ephemeral: true });
			return;
		}

		const rule = rules[number - 1];

		const message = (
			`${getEmoji('methuselah', interaction)} *Remember rule ${number}...*\n` +
			`> ${rule}`
		);

		interaction.reply(message);
	},
};

const getEmoji = (name, client) => {
	const id = client.guild.emojis.cache.find(emoji => emoji.name === name).id;
	return `<:${name}:${id}>`;
};