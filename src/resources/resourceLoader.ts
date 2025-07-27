import path from "path";
import yaml from "yaml";
import fs from "fs";

export function loadYaml<T>(name: string): T {
  const filePath = path.join(
    process.cwd(),
    "src",
    "resources",
    "yaml",
    `${name}.yaml`,
  );

  return yaml.parse(fs.readFileSync(filePath, "utf8")) as T;
}

export function loadMarkdown(name: string): string {
  const filePath = path.join(
    process.cwd(),
    "src",
    "resources",
    "markdown",
    `${name}.md`,
  );

  return fs.readFileSync(filePath, "utf8") as string;
}