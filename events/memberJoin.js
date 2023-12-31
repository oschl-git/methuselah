const { Events } = require('discord.js');
const quotes = require('./../static-data/welcome-quotes.json');
const { getEmojiByName } = require('../helpers/emojiManager');
const welcomeChannelRepository = require('../data/welcomeChannelRepository');

module.exports = {
	name: Events.GuildMemberAdd,
	async execute(member) {
		console.log(`[LOG] @${member.user.username} joined a server, triggered memberJoin.`);

		const message = (
			`${getEmojiByName('methuselah', member)} *${getRandomQuote()}*\n` +
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