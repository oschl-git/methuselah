# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Methuselah is a Discord bot for the The Long Dark Discord server. TypeScript ESM, discord.js v14, TypeORM with better-sqlite3, `config` (node-config) with YAML files. There is no build step and no test suite: `tsx` runs the TypeScript sources directly, and paths like `src/commands/handlers` are resolved at **runtime** relative to `process.cwd()`, so the bot must be started from the repo root.

## Commands

```bash
yarn dev                # Run the bot (NODE_ENV=development)
yarn prod               # Run the bot (NODE_ENV=production)
yarn eslint             # Lint src/
yarn prettier           # Format src/ and scripts/ (writes)
yarn prettier-check     # Format check only
yarn typeorm <args>     # TypeORM CLI via tsx
yarn script <file>      # Run a one-off script, e.g. yarn script scripts/importXpFromMee6.ts <path> <guildId>
```

Generate a migration after changing entities (the DataSource is `src/data/database.ts`):

```bash
yarn typeorm migration:generate -d src/data/database.ts src/data/migrations/migration
```

Migrations run automatically on startup (`database.migrationsRun: true` in config); `synchronize` is off. Note `config/development.yaml` may set `migrationsRun: false`.

## Configuration

`config/default.yaml` is versioned and must never be edited for local/secret values. `config/development.yaml` and `config/production.yaml` are gitignored and override it — `token` and `applicationId` live there. `NODE_ENV` selects which override file is loaded. `registerCommands` controls whether slash commands are pushed to the Discord API on startup.

## Architecture

Startup flow is `src/start.ts`: initialize DB → load commands → load events → Discord login → optionally register slash commands via REST (`commandDeployer`).

**Auto-discovery by directory.** `src/services/classLoader.ts` imports every `.ts` file in a directory and instantiates its default export (files whose default export isn't constructible, like the interface files, are silently skipped). Consequently:

- **New slash command** = new class in `src/commands/handlers/` implementing `CommandHandler` (`data: SlashCommandBuilder`, optional `cooldown` in seconds — default 5, `execute()`). No registration list to update.
- **New Discord event listener** = new class in `src/events/handlers/` implementing `EventHandler` (`name: Events.*`, `once`, `execute()`). Multiple handlers can listen to the same event.
- Also add new commands to `src/resources/yaml/helpCommands.yaml` — `/help` renders that YAML (filtered by `requiredPermission`) through the Handlebars template `src/resources/markdown/help.md`; it does not introspect registered commands.

**Command pipeline** (`src/commands/commandProcessor.ts`): every interaction passes user-block check (`userState`) → cooldown check (`cooldownManager`) → `execute()`, with errors caught and answered by an ephemeral `ErrorEmbed`. Handlers can assume this wrapper exists.

**Two-phase interaction pattern.** Commands like `/echo`, `/edit`, and `/setpermamessage` don't act immediately: they register a pending entry in an in-memory manager (`echoMessageManager`, `editMessageManager`, `permaMessageManager` in `src/services/`), which blocks the user via `userState` and sets an expiry timeout. A matching `MessageCreate` event handler in `src/events/handlers/` consumes the user's next message in that channel and performs the action. Follow this pattern for any "reply with your next message" feature.

**Imports use `.js` extensions** (`import x from "./foo.js"`) even though sources are `.ts` — keep that convention (ESM resolution under tsx).

**Persistence.** Entities in `src/data/entities/` (Channel, ReactionRole, UserXp, PermaMessage), migrations in `src/data/migrations/`. Access via `database.getRepository(Entity)`. Channel roles (e.g. which channel gets welcome messages) are rows in `channels` keyed by a `ChannelType` enum, set through `/setchannel`.

**XP system.** The `TrackUserInteraction` event handler feeds `xpManager`, which buffers a user's messages in memory for a 60-second window before computing XP (`xpCalculator`) and persisting to `UserXp`; level thresholds are in `levelCalculator`, and level-ups DM the user.

**Bot replies** use the embed subclasses in `src/responses/` (`SuccessEmbed`, `ErrorEmbed`, `InfoEmbed`, `WarningEmbed`, `CooldownEmbed`) rather than raw embeds. Static text/content lives in `src/resources/` (YAML lists, markdown templates) loaded through `resourceLoader`. The bot's signature emoji is fetched by name via `emojiLoader.tryGetEmojiString("methuselah", guild)`, which falls back from guild emojis to application emojis and caches results.

## Style

Prettier: 4-space indent, 120 print width — run `yarn prettier` before finishing. ESLint uses typescript-eslint `strict` + `stylistic` configs.

## Deployment

Pushing to the `production` branch triggers `.github/workflows/deploy.yaml`, which SSHes into the server, pulls, installs, and restarts the `methuselah` systemd service. `main` is the development branch.
