const { Events } = require('discord.js');
const reactionRoleMessagesRepository = require('../data/reactionRoleMessagesRepository');
const reactionRoles = require('../static-data/reaction-roles.json');

module.exports = {
	name: Events.MessageReactionAdd,
	async execute(interaction, user) {
		if (! await reactionRoleMessagesRepository.isReactionRoleMessage(interaction.message.id)) return;

		const role = reactionRoles[interaction._emoji.name];
		if (!role) {
			console.log('[WARNING] Member reacted to a reaction role message with an unhndled emoji. Check channel permissions.');
			return;
		};

		console.log(`[LOG] @${user.username} reacted to a reaction role message.`);

		const guildMember = await interaction.message.guild.members.fetch(user);
		guildMember.roles.add(reactionRoles[interaction._emoji.name]);
	}
};