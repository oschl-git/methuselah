import { Client, ClientEvents } from "discord.js";
import Event from "./handlers/Event.js";
import getEventIndex from "./eventLoader.js";
import logger from "../services/logger.js";

export async function loadEvents(client: Client): Promise<void> {
  const events = await getEventIndex();

  for (const event of events) {
    if (event.once) {
      client.once(event.name, (...args) => executeEvent(event, ...args));
    } else {
      client.on(event.name, (...args) => executeEvent(event, ...args));
    }
  }
}

async function executeEvent<T extends keyof ClientEvents>(
  event: Event<T>,
  ...args: ClientEvents[T]
): Promise<void> {
  try {
    await event.execute(...args);
    logger.info(`Event ${event.name} triggered successfully`);
  } catch (error) {
    logger.error(`Failed executing event ${event.name}`, error);
  }
}
