const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, Colors } = require('discord.js');
const welcomeChannels = require('../../helper_scripts/welcomeChannels.js');

module.exports = {
	cooldown: 10,
	data: new SlashCommandBuilder()
		.setName('delwelcomechannel')
		.setDescription('Unset this channel as a welcome channel.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false),
	async execute(interaction) {
		console.log(`[LOG] @${interaction.user.username} used the /delwelcomechannel command.`);

		let welcomeChannelArray = welcomeChannels.getWelcomeChannelsFromJson();

		if (!welcomeChannelArray.includes(interaction.channelId)) {
			const embed = new EmbedBuilder()
				.setDescription('**✕** this channel is not a welcome channel.')
				.setColor(Colors.Red);
			interaction.reply({ embeds: [embed], ephemeral: true });
			return;
		}

		welcomeChannelArray.splice(welcomeChannelArray.indexOf(interaction.channelId), 1);

		welcomeChannels.saveWelcomeChannelsToJson(welcomeChannelArray);

		const embed = new EmbedBuilder()
			.setDescription('**✓** unset this channel as a welcome channel.')
			.setColor(Colors.Green);
		interaction.reply({ embeds: [embed], ephemeral: true });
	},
};