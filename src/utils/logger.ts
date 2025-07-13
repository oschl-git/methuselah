import { Logger } from "tslog";
import assert from "node:assert";
import config from "config";
import manifest from "../../package.json" with { type: "json" };

const type = config.get<string>("log.type");
const minLevel = config.get<number>("log.minLevel");

assert(["json", "pretty", "hidden"].includes(type), "Invalid log type specified in configuration");
assert(minLevel >= 1 && minLevel <= 6, "Minimum log level must be between 0 and 6");

const logger = new Logger({
  name: manifest.name,
  type: type as "json" | "pretty" | "hidden",
  minLevel: minLevel,
});

process.on("uncaughtException", (error) => {
  logger.fatal(error);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.fatal(reason);
  process.exit(1);
});

export default logger;
