const { Events } = require('discord.js');
const reactionRoleMessagesRepository = require('../data/reactionRoleMessagesRepository');
const reactionRoles = require('../static-data/reaction-roles.json');

module.exports = {
	name: Events.MessageReactionRemove,
	async execute(interaction, user) {
		if (! await reactionRoleMessagesRepository.isReactionRoleMessage(interaction.message.id)) return;

		const role = reactionRoles[interaction._emoji.name];
		if (!role) return;

		console.log(`[LOG] @${user.username} removed a reaction from a reaction role message.`);

		const guildMember = await interaction.message.guild.members.fetch(user);
		guildMember.roles.remove(reactionRoles[interaction._emoji.name]);
	}
};