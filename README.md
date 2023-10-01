# Methuselah

> *Ancient in appearance, this bot's clear eyes suggest a deep wisdom and he radiates strength rather than frailty. He has the calm, knowing authority of someone who’s seen a few things in his time.*

**Methuselah is a custom bot for the The Long Dark Discord server.**

It uses the DiscordJS library to interact with the Discord API, and is written entirely in JavaScript, using NodeJS. Non-static data is stored in a PostgreSQL database.

Given the nature of the bot, it isn't particularly useful for any other Discord server, but many of its features and code can be easily adapted for your own needs.

## Important notes
- The bot needs a PostgreSQL database to store non-static data. The schema for this database can be found in the [postgresql-schema.sql](postgresql-schema.sql) file.
- To work correctly, the bot needs to have a `config.json` file in the project folder. It needs to be of the following format:
```
{
	"token": "<token>",
	"clientId": "<application ID>",
	"guildId": "<server ID>"
	"db": {
		"host": "<PostgreSQL server (e. g. "localhost")>",
		"port": <PostgreSQL port (integer) (e. g. 5432)>,
		"database": "<database name (e. g. "methuselah")>",
		"username": "<PostgreSQL username>",
		"password": "<PostgreSQL password>"
	}
}
```
**Make sure to never share this file with anyone and put it in your `.gitignore`.**
