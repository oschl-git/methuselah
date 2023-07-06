const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, Colors } = require('discord.js');
const welcomeChannels = require('../../helper_scripts/welcomeChannels.js');

module.exports = {
	cooldown: 10,
	data: new SlashCommandBuilder()
		.setName('setwelcomechannel')
		.setDescription('Sets this channel as a welcome channel. Methuselah will welcome people who join here.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false),
	async execute(interaction) {
		console.log(`[LOG] @${interaction.user.username} used the /setwelcomechannel command.`);

		let welcomeChannelArray = welcomeChannels.getWelcomeChannelsFromJson();

		if (welcomeChannelArray.includes(interaction.channelId)) {
			const embed = new EmbedBuilder()
				.setDescription('**✕** this channel is already a welcome channel.')
				.setColor(Colors.Red);
			interaction.reply({ embeds: [embed], ephemeral: true });
			return;
		}

		welcomeChannelArray.push(interaction.channelId);
		welcomeChannels.saveWelcomeChannelsToJson(welcomeChannelArray);

		const embed = new EmbedBuilder()
			.setDescription('**✓** welcome channel set!')
			.setColor(Colors.Green);
		interaction.reply({ embeds: [embed], ephemeral: true });
	},
};;