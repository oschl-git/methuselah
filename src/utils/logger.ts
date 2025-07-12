import { Logger } from "tslog";
import manifest from "../../package.json" with { type: "json" };
import config from "config";

export default new Logger({
  name: manifest.name,
  type: "pretty",
  minLevel: config.get<number>("minLogLevel") || 3,
  hideLogPositionForProduction: true,
});