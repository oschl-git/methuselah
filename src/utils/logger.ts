import { Logger } from "tslog";
import manifest from "../../package.json" with { type: "json" };
import config from "config";

export default new Logger({
  name: manifest.name,
  type: "pretty",
  minLevel: config.has("minLogLevel") ? config.get("minLogLevel") : 3,
  hideLogPositionForProduction: true,
});