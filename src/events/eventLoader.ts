import Event from "./handlers/Event.js";
import path from "path";
import assert from "assert";
import fs from "fs";
import yaml from "yaml";

export default async function getEventIndex(): Promise<Event[]> {
  const eventIndexPath = path.join(
    process.cwd(),
    "src",
    "events",
    "index.yaml",
  );

  assert(fs.existsSync(eventIndexPath), "Event index file does not exist");

  const eventIndex = yaml.parse(
    fs.readFileSync(eventIndexPath, "utf8"),
  ) as string[];

  const events = [];
  for (const filename of eventIndex) {
    const filePath = path.join(
      process.cwd(),
      "src",
      "events",
      "handlers",
      filename,
    );

    type EventConstructor = new (...args: unknown[]) => Event;

    const event = new ((await import(filePath)).default as EventConstructor)();

    events.push(event);
  }

  return events;
}
