import database from "../src/data/database.js";
import fs from "fs";
import logger from "../src/services/logger.js";
import UserXp from "../src/data/entities/UserXp.js";

interface Mee6Stats {
  user_id: number;
  avatar: string;
  discriminator: string;
  message_count: number;
  monetize_xp_boost: number;
  username: string;
  xp: number;
  level: number;
}

async function importXpFromMee6() {
  if (process.argv.length <= 3) {
    logger.error("Missing required arguments: <path> <guildId>");
    process.exit(1);
  }

  const path = process.argv[2];
  const guiildId = process.argv[3];

  const mee6Data = (await JSON.parse(
    fs.readFileSync(path, "utf8"),
  )) as Mee6Stats[];

  logger.info(
    `Importing ${mee6Data.length} users from ${path} into guild ${guiildId}`,
  );

  await database.initialize();
  const repository = database.getRepository(UserXp);

  for (const user of mee6Data) {
    const userXp = new UserXp();

    userXp.guildId = guiildId;
    userXp.userId = user.user_id.toString();
    userXp.username = user.username;
    userXp.messageCount = user.message_count;
    userXp.xp = user.xp;

    repository.save(userXp);

    logger.info(
      `Imported user ${user.user_id} (${user.username}) with ${user.message_count} messages and ${user.xp} XP`,
    );
  }

	logger.info("Done!");
}

await importXpFromMee6();
