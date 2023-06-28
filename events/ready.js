const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`[OK] Successfully started. Logged in as user [${client.user.tag}].`);
	},
};
