// Run this sciprt with node to reload guild commands. Pass in the "global" argument at the end to reload global commands.

const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const rest = new REST().setToken(token);

for (const isGlobal of [true, false]) {
	const commands = [];
	const commandsPath = isGlobal ? path.join(__dirname, 'commands', 'global') : path.join(__dirname, 'commands', 'guild');

	if (!fs.existsSync(commandsPath)) {
		console.log(`[INFO] There are no ${isGlobal ? 'global' : 'guild'} commands.`);
		continue;
	}

	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		}
		else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}


	(async () => {
		try {
			console.log(`[OK] Started refreshing ${commands.length} application (/) ${isGlobal ? 'global' : 'guild'} commands.`);

			let data;
			// The put method is used to fully refresh all commands in the guild with the current set
			if (!isGlobal) {
				data = await rest.put(
					Routes.applicationGuildCommands(clientId, guildId),
					{ body: commands },
				);
			}
			else {
				data = await rest.put(
					Routes.applicationCommands(clientId),
					{ body: commands },
				);
			}

			console.log(`[SUCCESS] Successfully refreshed ${data.length} application (/) ${isGlobal ? 'global' : 'guild'} commands.`);
		}
		catch (error) {
			console.error('[ERROR] There has been an issue refreshing a command.');
			console.error(error);
		}
	})();
}