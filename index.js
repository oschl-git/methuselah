#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const { token } = require('./config.json');
const { version } = require('./package.json');
const { testDatabaseConnection } = require('./data/db');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessageReactions,
	],
	partials: [
		Partials.Message,
		Partials.Channel,
		Partials.Reaction,
	],
});


// Collections:
client.cooldowns = new Collection();
client.sentPermamessages = new Collection();


console.log(`[INFO] Starting Methuselah ${version}...`);
runStartupChecks();
setupCommands();
setupEvents();
client.login(token);


async function runStartupChecks() {
	console.log('[INFO] Running startup checks...');

	if (!fs.existsSync('./config.json')) {
		console.error(`[CRITICAL] Couldn't find config.json.`);
		process.exit(1);
	} else {
		console.log('[OK] Located config.json.');
	}

	if (! await testDatabaseConnection()) {
		console.error(`[CRITICAL] Contacting database wasn't successful.`);
		process.exit(1);
	} else {
		console.log('[OK] Database connected.');
	}
}

function setupCommands() {
	client.commands = new Collection();
	const foldersPath = path.join(__dirname, 'commands');
	const commandFolders = fs.readdirSync(foldersPath);

	for (const folder of commandFolders) {
		const commandsPath = path.join(foldersPath, folder);
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = require(filePath);
			if ('data' in command && 'execute' in command) {
				client.commands.set(command.data.name, command);
			}
			else {
				console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
			}
		}
	}
};

function setupEvents() {
	const eventsPath = path.join(__dirname, 'events');
	const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

	for (const file of eventFiles) {
		const filePath = path.join(eventsPath, file);
		const event = require(filePath);
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args));
		}
		else {
			client.on(event.name, (...args) => event.execute(...args));
		}
	}
};