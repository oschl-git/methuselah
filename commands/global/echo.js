const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

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
		const content = interaction.options.getString('content') ?? null;

		if (content == null) {
			await interaction.reply({ content: 'No content provided.', ephemeral: true });
			return;
		}

		const channel = interaction.guild.channels.cache.get(interaction.channelId);
		channel.send(content);
		await interaction.reply({ content: 'Done!', ephemeral: true });
	},
};