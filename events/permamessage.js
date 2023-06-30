const { Events } = require('discord.js');
const { clientId } = require('../config.json');
const permamessages = require('../helper_scripts/permamessages.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		let permamessageMap = permamessages.getPermamessageMapFromJson();

		if (!permamessageMap.has(message.channelId)) return;

		let lastMessageId = permamessageMap.get(message.channelId).sentMessageId;
		let lastMessage;
		lastMessage = await message.channel.messages.fetch(lastMessageId).catch(e => {
			console.error('[ERROR] Couldn\'t fetch last permamessage.');
			console.error(e);
		});

		if (typeof lastMessage != 'undefined' && lastMessageId != null && lastMessage.author.id == clientId) {
			lastMessage.delete().catch(e => {
				console.error('[ERROR] Permamessage message deletion wasn\'t successful.');
				console.error(e);
				return;
			});
		}

		if (message.author.id != clientId) {
			let sentMessage = await message.channel.send(permamessageMap.get(message.channelId).content);
			permamessageMap.get(message.channelId).sentMessageId = sentMessage.id;
			permamessages.savePermamessageMapToJson(permamessageMap);
		}
	}
};