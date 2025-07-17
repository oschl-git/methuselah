# Methuselah 2.0

> *Ancient in appearance, this bot's clear eyes suggest a deep wisdom and he radiates strength rather than frailty. He has the calm, knowing authority of someone who’s seen a few things in his time.*

**Methuselah is a custom bot for the The Long Dark Discord server.**

It uses the DiscordJS library to interact with the Discord API, and is written entirely in TypeScript. An SQLite database is used to store data.

Given the nature of the bot, it isn't particularly useful for any other Discord server, but many of its features and code can be easily adapted for your own needs.

## Features
- welcoming people who join the server with a random quote from the game
- reminding server rules
- sending lifechanging wisdoms
- *permamessages*, messages posted by the bot which always stay "pinned" at the bottom of a channel
- echoing whatever administrators write
- command cooldowns/spam prevention

## Configuration
A [default.yaml](./config/default.yaml) file is used for default configuration, but two values must be overriden in `config/development.yaml` or `config/production.yaml`:
```yaml
token: "token"
applicationId: "applicationId"
```
Make sure these files are ignored in all version control and the **token is always kept secret**.

The default configuration file is versioned and should never be modified directly.

## License
The bot is licensed under the [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.en.html).
