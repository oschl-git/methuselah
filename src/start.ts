import { Client } from "discord.js";
import config from "config";
import logger from "./utils/logger.js";
import manifest from "../package.json" with { type: "json" };

try {
  await start();
} catch (error) {
  logger.error("An error occurred during startup:", error);
}

async function start(): Promise<void> {
  logger.info(`Starting version ${manifest.version}...`);

  const client = new Client({
    intents: [],
  });

  client.login(config.get<string>("token"));

  logger.info("Successfully started!");
}
