import "reflect-metadata";
import { DataSource, EntitySchema } from "typeorm";
import assert from 'node:assert';
import config from "config";
import fs from "fs";
import path from 'node:path';
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

async function getEntityIndex(): Promise<EntitySchema[]> {
	const eventIndexPath = path.join(
		process.cwd(),
		"src",
		"data",
		"index.yaml",
	);

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

		type EntityConstructor = new (...args: unknown[]) => EntitySchema;

		const event = new ((await import(filePath)).default as EntityConstructor)();

		entities.push(event);
	}

	return entities;
}

export default dataSource;