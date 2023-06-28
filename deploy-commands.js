// Run this sciprt with node to reload guild commands. Pass in the "global" argument at the end to reload global commands.

const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

// If global is passed to the script, this value will be true.
const isGlobal = process.argv.slice(2)[0] == 'global';

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandsPath = isGlobal ? path.join(__dirname, 'commands', 'global') : path.join(__dirname, 'commands', 'guild');

const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
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

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) ${isGlobal ? 'global' : 'guild'} commands.`);

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

		console.log(`Successfully reloaded ${data.length} application (/) ${isGlobal ? 'global' : 'guild'} commands.`);
	}
	catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
