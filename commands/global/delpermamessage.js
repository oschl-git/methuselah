const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, Colors } = require('discord.js');
const permamessageRepository = require('../../data/permamessageRepository');

module.exports = {
	cooldown: 10,
	data: new SlashCommandBuilder()
		.setName('delpermamessage')
		.setDescription('Deletes this channel\'s permamessage.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false),
	async execute(interaction) {
		console.log(`[LOG] @${interaction.user.username} used the /delpermamessage command.`);

		if (! await permamessageRepository.doesChannelHavePermamessage(interaction.channelId)) {
			const embed = new EmbedBuilder()
				.setDescription('**✕** this channel doesn\'t have a permamessage.')
				.setColor(Colors.Red);
			interaction.reply({ embeds: [embed], ephemeral: true });
			return;
		}

		permamessageRepository.deletePermamessageByChannelId(interaction.channelId);

		const embed = new EmbedBuilder()
			.setDescription('**✓** permamessage successfully disabled.')
			.setColor(Colors.Green);
		interaction.reply({ embeds: [embed], ephemeral: true });
	},
};