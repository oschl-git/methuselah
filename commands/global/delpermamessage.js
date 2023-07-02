const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const permamessages = require('../../helper_scripts/permamessages.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delpermamessage')
		.setDescription('Delete this channel\'s permamessage.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false),
	async execute(interaction) {
		console.log(`[LOG] @${interaction.user.username} used the /delpermamessage command.`);

		let permamessageMap = permamessages.getPermamessageMapFromJson();

		if (!permamessageMap.has(interaction.channelId)) {
			await interaction.reply({
				content:
					'This channel doesn\'t have a permamessage.'
				, ephemeral: true
			});
			return;
		}

		permamessageMap.delete(interaction.channelId);
		permamessages.savePermamessageMapToJson(permamessageMap);

		await interaction.reply({ content: 'Permamessage successfully disabled.', ephemeral: true });
	},
};