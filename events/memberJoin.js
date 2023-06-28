const { Events } = require('discord.js');
const welcomeChannels = require('./../command_config/welcomeChannels.json');
const quotes = require('./../command_config/welcomeQuotes.json');

module.exports = {
	name: Events.GuildMemberAdd,
	async execute(member) {
		const message = (
			`${getEmoji('methuselah', member)} *${getRandomQuote()}${'*\n'}` +
			`**${member} just joined the server.**`
		);

		for (const channelId of welcomeChannels) {
			const channel = member.guild.channels.cache.get(channelId);
			if (channel == null) continue;
			channel.send(message);
		}
	},
};

const getRandomQuote = () => {
	return quotes[Math.floor(Math.random() * quotes.length)];
};

const getEmoji = (name, client) => {
	const id = client.guild.emojis.cache.find(emoji => emoji.name === name).id;
	return `<:${name}:${id}>`;
};