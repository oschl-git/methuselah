const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, Colors } = require('discord.js');
const welcomeChannelRepository = require('../../data/welcomeChannelRepository.js');

module.exports = {
	cooldown: 10,
	data: new SlashCommandBuilder()
		.setName('setwelcomechannel')
		.setDescription('Sets this channel as a welcome channel. Methuselah will welcome people who join here.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false),
	async execute(interaction) {
		console.log(`[LOG] @${interaction.user.username} used the /setwelcomechannel command.`);

		if (await welcomeChannelRepository.isWelcomeChannel(interaction.channelId)) {
			const embed = new EmbedBuilder()
				.setDescription('**✕** this channel is already a welcome channel.')
				.setColor(Colors.Red);
			interaction.reply({ embeds: [embed], ephemeral: true });
			return;
		}

		await welcomeChannelRepository.saveWelcomeChannel(interaction.channelId);

		const embed = new EmbedBuilder()
			.setDescription('**✓** welcome channel set!')
			.setColor(Colors.Green);
		interaction.reply({ embeds: [embed], ephemeral: true });
	},
};;