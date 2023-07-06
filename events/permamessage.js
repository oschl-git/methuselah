const { Events, Collection } = require('discord.js');
const { clientId } = require('../config.json');
const permamessages = require('../helper_scripts/permamessages.js');
const { cooldown } = require('../commands/global/setpermamessage');

const permamessageDelay = 3000;

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		let permamessageMap = permamessages.getPermamessageMapFromJson();

		if (!permamessageMap.has(message.channelId)) return;
		if (message.author.id == clientId) return;

		console.log(`[LOG] @${message.author.username} triggered permamessage.`);

		let lastMessageId = permamessageMap.get(message.channelId).sentMessageId;
		let lastMessage = await message.channel.messages.fetch(lastMessageId).catch(e => {
			console.error('[ERROR] Couldn\'t fetch last permamessage.');
			console.error(e);
		});

		const { sentPermamessages } = message.client;

		// Clear planned timeout if it exists
		if (sentPermamessages.has(message.channelId)) {
			try {
				const timeoutId = sentPermamessages.get(message.channelId);
				sentPermamessages.delete(message.channelId);
				clearTimeout(timeoutId);
			}
			catch (e) {
				console.error('[WARNING] Error stopping permamessage timeout.');
				console.error(e);
			}
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