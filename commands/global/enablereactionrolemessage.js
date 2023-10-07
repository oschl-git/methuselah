const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, Colors } = require('discord.js');
const reactionRoleMessagesRepository = require('../../data/reactionRoleMessagesRepository');

module.exports = {
	cooldown: 10,
	data: new SlashCommandBuilder()
		.setName('enablereactionrolemessage')
		.setDescription('Sets the message of the provided ID to be a reaction role message.')
		.addStringOption(option =>
			option
				.setName('message-id')
				.setDescription('Specifies the message.')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false),
	async execute(interaction) {
		console.log(`[LOG] @${interaction.user.username} used the /enablereactionrolemessage command.`);

		const messageId = interaction.options.getString('message-id') ?? null;
		if (messageId == null) {
			const embed = new EmbedBuilder()
				.setDescription('**✕** no message ID provided.')
				.setColor(Colors.Red);
			interaction.reply({ embeds: [embed], ephemeral: true });
			return;
		}

		try {
			await interaction.channel.messages.fetch(messageId);
		}
		catch (e) {
			const embed = new EmbedBuilder()
				.setDescription('**✕** couldn\'t fetch message of the provided ID.')
				.setColor(Colors.Red);
			interaction.reply({ embeds: [embed], ephemeral: true });
			return;
		}

		if (await reactionRoleMessagesRepository.isReactionRoleMessage(messageId)) {
			const embed = new EmbedBuilder()
				.setDescription('**✕** this message is already a reaction role message.')
				.setColor(Colors.Red);
			interaction.reply({ embeds: [embed], ephemeral: true });
			return;
		}

		await reactionRoleMessagesRepository.saveMessage(messageId);

		const embed = new EmbedBuilder()
			.setDescription('**✓** reaction role message set!')
			.setColor(Colors.Green);
		interaction.reply({ embeds: [embed], ephemeral: true });
	},
};;