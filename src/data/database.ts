import "reflect-metadata";
import { DataSource } from "typeorm";
import config from "config";
import DatabaseLogger from "./DatabaseLogger.js";
import path from "path";

export default new DataSource({
  type: "sqlite",
  database: config.get<string>("database.filename"),
  entities: [path.join(process.cwd(), "src", "data", "entities", "*.ts")],
  migrations: [path.join(process.cwd(), "src", "data", "migrations", "*.ts")],
  logger: config.get<boolean>("database.logging")
    ? new DatabaseLogger()
    : undefined,
  synchronize: config.get<boolean>("database.synchronize"),
  migrationsRun: config.get<boolean>("database.migrationsRun"),
});
