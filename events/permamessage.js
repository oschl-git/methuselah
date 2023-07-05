const { Events, Collection } = require('discord.js');
const { clientId } = require('../config.json');
const permamessages = require('../helper_scripts/permamessages.js');
const { cooldown } = require('../commands/global/setpermamessage');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		const permamessageDelay = 3000;

		let permamessageMap = permamessages.getPermamessageMapFromJson();

		if (!permamessageMap.has(message.channelId)) return;
		if (message.author.id == clientId) return;

		console.log(`[LOG] @${message.author.username} triggered permamessage.`);

		let lastMessageId = permamessageMap.get(message.channelId).sentMessageId;
		let lastMessage;
		lastMessage = await message.channel.messages.fetch(lastMessageId).catch(e => {
			console.error('[ERROR] Couldn\'t fetch last permamessage.');
			console.error(e);
		});

		const { sentPermamessages } = message.client;

		// Clear planned timeout if it exists
		if (sentPermamessages.has(message.channelId)) {
			clearTimeout(sentPermamessages.get(message.channelId));
			sentPermamessages.delete(message.channelId);
		}

		if (typeof lastMessage != 'undefined' && lastMessageId != null && lastMessage.author.id == clientId) {
			sentPermamessages.set(message.channelId, setTimeout(async () => {
				sentPermamessages.delete(message.channelId);
				lastMessage.delete().catch(e => {
					console.error('[ERROR] Permamessage message deletion wasn\'t successful.');
					console.error(e);
					return;
				});

				let sentMessage = await message.channel.send(permamessageMap.get(message.channelId).content);
				permamessageMap.get(message.channelId).sentMessageId = sentMessage.id;
				permamessages.savePermamessageMapToJson(permamessageMap);
			}, permamessageDelay));
		}
	}
};