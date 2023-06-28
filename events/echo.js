const { Events, PermissionsBitField } = require('discord.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		const prefix = 'm!echo';

		if (!message.member.permissionsIn(message.channel).has(PermissionsBitField.Flags.Administrator)) return;
		if (message.content.split(/\s/)[0] != prefix) return;

		let content = message.content.substring(prefix.length + 1);

		const channel = message.guild.channels.cache.get(message.channelId);
		message.delete();
		channel.send(content);
	},
};
