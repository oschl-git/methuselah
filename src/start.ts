import { Client } from "discord.js";
import * as commandProcessor from "./commands/commandProcessor.js";
import config from "config";
import logger from "./utils/logger.js";
import manifest from "../package.json" with { type: "json" };

logger.info(`Starting ${manifest.name} ${manifest.version}...`);

const client = new Client({
  intents: [],
});

logger.info("Loading commands...");
commandProcessor.loadCommands(client);

await client.login(config.get<string>("token"));

await new Promise<void>((resolve) => {
  if (client.isReady()) return resolve();
  client.once("ready", () => resolve());
});

logger.info(`Logged in as [@${(client as Client<true>).user.tag}]`);
