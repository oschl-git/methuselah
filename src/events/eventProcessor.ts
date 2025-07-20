import { Client, ClientEvents } from "discord.js";
import EventHandler from "./handlers/EventHandler.js";
import importInstancesFromDirectory from "../services/classLoader.js";
import logger from "../services/logger.js";
import path from "path";

export async function loadEvents(client: Client): Promise<void> {
  const events = await importInstancesFromDirectory<EventHandler>(
    path.join(process.cwd(), "src", "events", "handlers"),
  );

  for (const event of events) {
    if (event.once) {
      client.once(event.name, (...args) => executeEvent(event, ...args));
    } else {
      client.on(event.name, (...args) => executeEvent(event, ...args));
    }
  }
}

async function executeEvent<T extends keyof ClientEvents>(
  event: EventHandler<T>,
  ...args: ClientEvents[T]
): Promise<void> {
  try {
    await event.execute(...args);
  } catch (error) {
    logger.error(`Failed executing event ${event.name}`, error);
  }
}
