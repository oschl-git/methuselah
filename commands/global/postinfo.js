const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, Colors, AttachmentBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const INFO_CHANNELS_PATH = path.join(__dirname, '../../static-data/info-channels');
const MESSAGE_INTERVAL = 500;

module.exports = {
	cooldown: 1,
	data: new SlashCommandBuilder()
		.setName('postinfo')
		.setDescription('Posts the content of an info channel.')
		.addStringOption(option =>
			option
				.setName('channel-name')
				.setDescription('Specifies what info to post.')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false),
	async execute(interaction) {
		console.log(`[LOG] @${interaction.user.username} used the /postinfo command.`);

		const channelName = interaction.options.getString('channel-name') ?? null;

		if (channelName == null) {
			const embed = new EmbedBuilder()
				.setDescription('**✕** no channel provided.')
				.setColor(Colors.Red);
			interaction.reply({ embeds: [embed], ephemeral: true });
			return;
		}

		const directories = fs.readdirSync(INFO_CHANNELS_PATH);
		let directoryPath = null;
		for (const directory of directories) {
			if (directory === channelName && fs.statSync(path.join(INFO_CHANNELS_PATH, directory)).isDirectory()) {
				directoryPath = path.join(INFO_CHANNELS_PATH, directory);
				break;
			}
		}

		if (directoryPath === null) {
			const embed = new EmbedBuilder()
				.setDescription('**✕** couldn\'t find info for channel.')
				.setColor(Colors.Red);
			interaction.reply({ embeds: [embed], ephemeral: true });
			return;
		}

		const layoutPath = path.join(directoryPath, 'layout.json');
		let layoutArray;
		try {
			const layout = fs.readFileSync(layoutPath, 'utf-8');
			layoutArray = JSON.parse(layout);
		} catch {
			const embed = new EmbedBuilder()
				.setDescription('**✕** error reading layout file.')
				.setColor(Colors.Red);
			interaction.reply({ embeds: [embed], ephemeral: true });
			return;
		}

		const channel = interaction.guild.channels.cache.get(interaction.channelId);

		interaction.deferReply({ ephemeral: true });

		for (const message of layoutArray) {
			sendParsedMessage(channel, message, directoryPath);
			await new Promise(r => setTimeout(r, MESSAGE_INTERVAL));
		}

		const embed = new EmbedBuilder()
			.setDescription('**✓** done!')
			.setColor(Colors.Green);
		interaction.editReply({ embeds: [embed] });
	},
};

function sendParsedMessage(channel, message, directoryPath) {
	if (message.startsWith(':')) {
		const image = new AttachmentBuilder(path.join(directoryPath, message.slice(1)));
		channel.send({ files: [image] });
		return;
	}

	channel.send(message);
}