const { Events } = require('discord.js');

module.exports = {
	name: Events.MessageReactionAdd,
	async execute(member) {
		// console.log(`[LOG] @${member.user.username} reacted to a message.`);
	},
};