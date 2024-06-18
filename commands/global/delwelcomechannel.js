const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, Colors } = require('discord.js');
const welcomeChannelRepository = require('../../data/welcomeChannelRepository.js');

module.exports = {
	cooldown: 10,
	data: new SlashCommandBuilder()
		.setName('delwelcomechannel')
		.setDescription('Unsets this channel as a welcome channel.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false),
	async execute(interaction) {
		console.log(`[LOG] @${interaction.user.username} used the /delwelcomechannel command.`);

		if (! await welcomeChannelRepository.isWelcomeChannel(interaction.channelId)) {
			const embed = new EmbedBuilder()
				.setDescription('**✕** this channel is not a welcome channel.')
				.setColor(Colors.Red);
			interaction.reply({ embeds: [embed], ephemeral: true });
			return;
		}

		await welcomeChannelRepository.deleteWelcomeChannel(interaction.channelId);

		const embed = new EmbedBuilder()
			.setDescription('**✓** unset this channel as a welcome channel.')
			.setColor(Colors.Green);
		interaction.reply({ embeds: [embed], ephemeral: true });
	},
};