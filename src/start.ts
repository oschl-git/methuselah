import { Client } from "discord.js";
import * as commandProcessor from "./commands/commandProcessor.js";
import * as commandDeployer from "./commands/commandDeployer.js";
import config from "config";
import logger from "./utils/logger.js";
import manifest from "../package.json" with { type: "json" };

logger.info(`Starting ${manifest.name} ${manifest.version}...`);

const client = new Client({
  intents: [],
});

logger.info("Attempting to register commands with the Discord API...");

try {
  const result = await commandDeployer.registerCommands();
  logger.info(`Successfully registered ${result.length} commands`);
} catch (error) {
  logger.error("Failed registering commands with the Discord API", error);
}

logger.info("Loading commands...");
await commandProcessor.loadCommands(client);

await client.login(config.get<string>("token"));

await new Promise<void>((resolve) => {
  if (client.isReady()) return resolve();
  client.once("ready", () => resolve());
});

logger.info(`Logged in as [@${(client as Client<true>).user.tag}]`);
