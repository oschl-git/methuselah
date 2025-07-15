import { Client } from "discord.js";
import loadEventIndex from "./eventLoader.js";

export async function loadEvents(client: Client): Promise<void> {
  const events = await loadEventIndex();

  for (const event of events) {
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }
}
