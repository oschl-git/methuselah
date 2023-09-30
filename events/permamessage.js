const { Events, Collection } = require('discord.js');
const { clientId } = require('../config.json');
const permamessages = require('../helper_scripts/permamessages.js');
const permamessageRepository = require('../data/permamessageRepository');
const { cooldown } = require('../commands/global/setpermamessage');

const permamessageDelay = 3000;

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		if (! await permamessageRepository.doesChannelHavePermamessage(message.channelId)) return;
		if (message.author.id == clientId) return;

		console.log(`[LOG] @${message.author.username} triggered permamessage.`);

		const storedPermamessage = await permamessageRepository.getPermamessageByChannelId(message.channelId);

		let lastMessage = await message.channel.messages.fetch(storedPermamessage.sent_message_id).catch(e => {
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

		if (typeof lastMessage != 'undefined' && storedPermamessage.sent_message_id != null && lastMessage.author.id == clientId) {
			sentPermamessages.set(message.channelId, setTimeout(async () => {
				sentPermamessages.delete(message.channelId);
				lastMessage.delete().catch(e => {
					console.error('[ERROR] Permamessage message deletion wasn\'t successful.');
					console.error(e);
					return;
				});
				let sentMessage = await message.channel.send(storedPermamessage.content);
				permamessageRepository.savePermamessage(
					message.channelId,
					sentMessage.id,
					storedPermamessage.content
				);
			}, permamessageDelay));
		}
	}
};