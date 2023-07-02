const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const welcomeChannels = require('../../helper_scripts/welcomeChannels.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setwelcomechannel')
		.setDescription('Set this channel as a welcome channel. Methuselah will welcome people who join here.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false),
	async execute(interaction) {
		console.log(`[LOG] @${interaction.user.username} used the /setwelcomechannel command.`);

		let welcomeChannelArray = welcomeChannels.getWelcomeChannelsFromJson();

		if (welcomeChannelArray.includes(interaction.channelId)) {
			await interaction.reply({
				content:
					'**✕ this channel is already a welcome channel.**'
				, ephemeral: true
			});
			return;
		}

		welcomeChannelArray.push(interaction.channelId);

		welcomeChannels.saveWelcomeChannelsToJson(welcomeChannelArray);

		interaction.reply({ content: '**✓ welcome channel set!**', ephemeral: true });
	},
};