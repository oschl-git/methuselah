import { Client } from "discord.js";
import config from "config";
import logger from './utils/logger.js';
import manifest from "../package.json" with { type: "json" };

start();

async function start(): Promise<void> {
	logger.info(`starting version ${manifest.version}...`);

  const client = new Client({
    intents: [],
  });
	
  client.login(config.get<string>("token"));

	logger.info("successfully started!");
}
