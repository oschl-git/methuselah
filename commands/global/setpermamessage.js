const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const permamessages = require('../../helper_scripts/permamessages.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setpermamessage')
		.setDescription('Whatever you write will forever stay as the last message in the channel.')
		.addStringOption(option =>
			option
				.setName('content')
				.setDescription('The content of the permamessage.')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false),
	async execute(interaction) {
		const content = interaction.options.getString('content') ?? null;

		if (content == null) {
			await interaction.reply({ content: 'No content provided.', ephemeral: true });
			return;
		}

		let permamessageMap = permamessages.getPermamessageMapFromJson();

		if (permamessageMap.has(interaction.channelId)) {
			await interaction.reply({
				content:
					'This channel already has a permamessage. Use /delpermamessage first to replace it.'
				, ephemeral: true
			});
			return;
		}

		const channel = interaction.guild.channels.cache.get(interaction.channelId);
		let sentMessage = await channel.send(content);

		permamessageMap.set(interaction.channelId, {
			content: content,
			sentMessageId: sentMessage.id,
		});

		permamessages.savePermamessageMapToJson(permamessageMap);

		interaction.reply({ content: 'Permamessage set!', ephemeral: true });
	},
};