import { Logger } from "typeorm";
import logger from "../services/logger.js";

export default class DatabaseLogger implements Logger {
  logQuery(query: string, parameters?: unknown[]) {
    logger.info("[QUERY]", query, parameters || []);
  }

  logQueryError(error: string | Error, query: string, parameters?: unknown[]) {
    logger.error("[QUERY ERROR]", error, query, parameters || []);
  }

  logQuerySlow(time: number, query: string, parameters?: unknown[]) {
    logger.warn("[SLOW QUERY]", time + "ms", query, parameters || []);
  }

  logSchemaBuild(message: string) {
    logger.info("[SCHEMA BUILD]", message);
  }

  logMigration(message: string) {
    logger.info("[MIGRATION]", message);
  }

  log(level: "log" | "info" | "warn", message: unknown) {
    if (level === "log") {
      logger.info("[LOG]", message);
    } else if (level === "info") {
      logger.info("[INFO]", message);
    } else if (level === "warn") {
      logger.warn("[WARN]", message);
    }
  }
}
