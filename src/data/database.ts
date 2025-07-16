import "reflect-metadata";
import { DataSource, EntitySchema } from "typeorm";
import assert from "node:assert";
import config from "config";
import fs from "fs";
import path from "node:path";
import yaml from "yaml";

const dataSource = new DataSource({
  type: "sqlite",
  database: config.get<string>("database.filename"),
  entities: await getEntityIndex(),
  synchronize: true,
  logging: false,
});

export async function initializeDatabase(): Promise<void> {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
}

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

export default dataSource;
