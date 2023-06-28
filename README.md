# Methuselah

> *Ancient in appearance, this bot's clear eyes suggest a deep wisdom and he radiates strength rather than frailty. He has the calm, knowing authority of someone who’s seen a few things in his time.*

Methuselah is a custom bot for the The Long Dark Discord server.

## Important notes
- To work correctly, the bot needs to have a config.json file in the project folder. It needs to be of the following format:
```
{
	"token": "<token here>",
	"clientId": "<client it>",
	"guildId": "<guild id>",
	"welcomeChannels": [
		<array of channels IDs in which the bot welcomes people>
	]
}
```
Make sure to never share this file with anyone and put it in your `.gitignore`.
