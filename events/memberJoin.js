const { Events } = require('discord.js');
const quotes = require('./../command-data/welcome-quotes.json');
const welcomeChannelRepository = require('../data/welcomeChannelRepository');

module.exports = {
	name: Events.GuildMemberAdd,
	async execute(member) {
		console.log(`[LOG] @${member.user.username} joined a server, triggered memberJoin.`);

		const message = (
			`${getEmoji('methuselah', member)} *${getRandomQuote()}*\n` +
			`**${member} just joined the server.**`
		);

		const welcomeChannels = await welcomeChannelRepository.getWelcomeChannelIds();
		try {
			for (const channelId of welcomeChannels) {
				const channel = member.guild.channels.cache.get(channelId);
				if (channel == null) continue;
				channel.send(message);
			}
		}
		catch {
			console.error('[CRITICAL] Failed iterating through welcomeChannels JSON.');
			console.error(error);
			throw error;
		}
	},
};

function getRandomQuote() {
	return quotes[Math.floor(Math.random() * quotes.length)];
}

function getEmoji(name, client) {
	try {
		const id = client.guild.emojis.cache.find(emoji => emoji.name === name).id;
		return `<:${name}:${id}>`;
	}
	catch {
		return '';
	}
}