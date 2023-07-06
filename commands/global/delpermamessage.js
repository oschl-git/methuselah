const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, Colors } = require('discord.js');
const permamessages = require('../../helper_scripts/permamessages.js');

module.exports = {
	cooldown: 10,
	data: new SlashCommandBuilder()
		.setName('delpermamessage')
		.setDescription('Deletes this channel\'s permamessage.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false),
	async execute(interaction) {
		console.log(`[LOG] @${interaction.user.username} used the /delpermamessage command.`);

		let permamessageMap = permamessages.getPermamessageMapFromJson();

		if (!permamessageMap.has(interaction.channelId)) {
			const embed = new EmbedBuilder()
				.setDescription('**✕** this channel doesn\'t have a permamessage.')
				.setColor(Colors.Red);
			interaction.reply({ embeds: [embed], ephemeral: true });
			return;
		}

		permamessageMap.delete(interaction.channelId);
		permamessages.savePermamessageMapToJson(permamessageMap);

		const embed = new EmbedBuilder()
			.setDescription('**✓** permamessage successfully disabled.')
			.setColor(Colors.Green);
		interaction.reply({ embeds: [embed], ephemeral: true });
	},
};