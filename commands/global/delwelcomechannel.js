const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const welcomeChannels = require('../../helper_scripts/welcomeChannels.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delwelcomechannel')
		.setDescription('Unset this channel as a welcome channel.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false),
	async execute(interaction) {
		console.log(`[LOG] @${interaction.user.username} used the /delwelcomechannel command.`);

		let welcomeChannelArray = welcomeChannels.getWelcomeChannelsFromJson();

		if (!welcomeChannelArray.includes(interaction.channelId)) {
			await interaction.reply({
				content:
					'**✕ this channel is not a welcome channel.**'
				, ephemeral: true
			});
			return;
		}

		welcomeChannelArray.splice(welcomeChannelArray.indexOf(interaction.channelId), 1);

		welcomeChannels.saveWelcomeChannelsToJson(welcomeChannelArray);

		interaction.reply({ content: '**✓ unset this channel as a welcome channel.**', ephemeral: true });
	},
};