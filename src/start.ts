import { Client, Events } from "discord.js";
import config from "config";
import logger from "./utils/logger.js";
import manifest from "../package.json" with { type: "json" };

start();

async function start(): Promise<void> {
  logger.info(`Starting version ${manifest.version}...`);

  const client = new Client({
    intents: [],
  });

  client.on(Events.ClientReady, (readyClient) => {
    logger.info(`Logged in as ${readyClient.user.tag}!`);
  });
  
  client.login(config.get<string>("token"));
}
