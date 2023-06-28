const { Events } = require('discord.js');
const { clientId } = require('../config.json');
const permamessages = require('../helper_scripts/permamessages.js');


module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		let permamessageMap = permamessages.getPermamessageMapFromJson();

		if (!permamessageMap.has(message.channelId)) return;

		let lastMessages = await message.channel.messages.fetch({ limit: 2 });
		let oldBotMessage = lastMessages.last();

		if (lastMessages.size >= 2 && oldBotMessage.author.id == clientId) {
			oldBotMessage.delete().catch(error => {
				console.error('[ERROR] Permamessage message deletion wasn\'t successful.');
				console.error(error);
			});
		}

		if (message.author.id != clientId) {
			message.channel.send(permamessageMap.get(message.channelId));
		}
	}
};