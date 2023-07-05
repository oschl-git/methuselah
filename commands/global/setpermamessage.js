const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, Colors } = require('discord.js');
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
		console.log(`[LOG] @${interaction.user.username} used the /setpermamessage command.`);

		const content = interaction.options.getString('content') ?? null;

		if (content == null) {
			const embed = new EmbedBuilder()
				.setDescription(
					'**✕** no content provided.')
				.setColor(Colors.Red);
			interaction.reply({ embeds: [embed], ephemeral: true });
			return;
		}

		let permamessageMap = permamessages.getPermamessageMapFromJson();

		if (permamessageMap.has(interaction.channelId)) {
			const embed = new EmbedBuilder()
				.setDescription(
					'**✕** this channel already has a permamessage. Use /delpermamessage first to replace it.')
				.setColor(Colors.Red);
			interaction.reply({ embeds: [embed], ephemeral: true });
			return;
		}

		const channel = interaction.guild.channels.cache.get(interaction.channelId);
		let sentMessage = await channel.send(content);

		permamessageMap.set(interaction.channelId, {
			content: content,
			sentMessageId: sentMessage.id,
		});

		permamessages.savePermamessageMapToJson(permamessageMap);


		const embed = new EmbedBuilder()
			.setDescription('**✓** permamessage set!')
			.setColor(Colors.Green);
		interaction.reply({ embeds: [embed], ephemeral: true });
	},
};