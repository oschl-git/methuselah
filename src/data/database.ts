import "reflect-metadata";
import { DataSource, EntitySchema } from "typeorm";
import assert from "node:assert";
import config from "config";
import DatabaseLogger from "./DatabaseLogger.js";
import fs from "fs";
import path from "node:path";
import yaml from "yaml";

export default new DataSource({
  type: "sqlite",
  database: config.get<string>("database.filename"),
  entities: await getEntityIndex(),
  logger: config.get<boolean>("database.logging")
    ? new DatabaseLogger()
    : undefined,
  synchronize: config.get<boolean>("database.synchronize"),
});

async function getEntityIndex(): Promise<EntitySchema<unknown>[]> {
  const eventIndexPath = path.join(process.cwd(), "src", "data", "index.yaml");

  assert(fs.existsSync(eventIndexPath), "Event index file does not exist");

  const eventIndex = yaml.parse(
    fs.readFileSync(eventIndexPath, "utf8"),
  ) as string[];

  const entities = [];
  for (const filename of eventIndex) {
    const filePath = path.join(
      process.cwd(),
      "src",
      "data",
      "entities",
      filename,
    );

    entities.push((await import(filePath)).default as EntitySchema<unknown>);
  }

  return entities;
}
