import fs from "fs/promises";
import path from "path";

export default async function importInstancesFromDirectory<T>(
  directoryPath: string,
): Promise<T[]> {
  const files = await fs.readdir(directoryPath);
  const instances: T[] = [];

  for (const file of files) {
    if (!file.endsWith(".ts")) continue;

    const filePath = path.join(directoryPath, file);

    const module = await import(filePath);
    const Constructor = module.default as new (...args: unknown[]) => T;

		let instance;
    try {
      instance = new Constructor();
		} catch (error) {
			if (!(error instanceof TypeError)) {
				throw error;
			}

			continue;
    }

    instances.push(instance);
  }

  return instances;
}
