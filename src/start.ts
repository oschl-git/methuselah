import { Client, GatewayIntentBits } from "discord.js";
import * as commandDeployer from "./commands/commandDeployer.js";
import * as commandProcessor from "./commands/commandProcessor.js";
import * as eventProcessor from "./events/eventProcessor.js";
import config from "config";
import * as database from "./data/database.js";
import logger from "./services/logger.js";
import manifest from "../package.json" with { type: "json" };


logger.info(`Starting ${manifest.name} ${manifest.version}...`);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

logger.info("Initializing database...");
await database.initializeDatabase();

logger.info("Loading commands...");
await commandProcessor.loadCommands(client);

logger.info("Loading events...");
await eventProcessor.loadEvents(client);

if (config.get<boolean>("registerCommands")) {
  logger.info("Attempting to register commands with the Discord API...");

  try {
    const result = await commandDeployer.registerCommands();
    logger.info(`Successfully registered ${result.length} commands`);
  } catch (error) {
    logger.error("Failed registering commands with the Discord API", error);
  }
} else {
  logger.warn(
    "Command registration with the Discord API is disabled in the configuration",
  );
}

await client.login(config.get<string>("token"));

await new Promise<void>((resolve) => {
  if (client.isReady()) return resolve();
  client.once("ready", () => resolve());
});

logger.info(`Logged in as [@${(client as Client<true>).user.tag}]`);
