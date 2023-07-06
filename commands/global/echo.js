const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, Colors } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('echo')
		.setDescription('Repeats whatever you write.')
		.addStringOption(option =>
			option
				.setName('content')
				.setDescription('The content of the echoed message.')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false),
	async execute(interaction) {
		console.log(`[LOG] @${interaction.user.username} used the /echo command.`);

		const content = interaction.options.getString('content') ?? null;

		if (content == null) {
			const embed = new EmbedBuilder()
				.setDescription('**✕** no content provided.')
				.setColor(Colors.Red);
			interaction.reply({ embeds: [embed], ephemeral: true });
			return;
		}

		// Echo:
		const channel = interaction.guild.channels.cache.get(interaction.channelId);
		channel.send(content);

		// Confirmation reply:
		const embed = new EmbedBuilder()
			.setDescription('**✓** done!')
			.setColor(Colors.Green);
		interaction.reply({ embeds: [embed], ephemeral: true });
	},
};