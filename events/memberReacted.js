const { Events } = require('discord.js');
const reactionRoleMessagesRepository = require('../data/reactionRoleMessagesRepository');

module.exports = {
	name: Events.MessageReactionAdd,
	async execute(member) {
		// console.log(`[LOG] @${member.user.username} reacted to a message.`);
	},
};