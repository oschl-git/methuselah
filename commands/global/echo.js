const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	cooldown: 1,
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
			await interaction.reply({ content: '**✕ no content provided.**', ephemeral: true });
			return;
		}

		const channel = interaction.guild.channels.cache.get(interaction.channelId);
		channel.send(content);
		await interaction.reply({ content: '**✓ done!**', ephemeral: true });
	},
};