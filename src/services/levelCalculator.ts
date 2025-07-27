import database from "../data/database.js";
import logger from "./logger.js";
import UserXp from "../data/entities/UserXp.js";

interface UserInteraction {
  messageLength: number;
}

const trackedUserInteractions = new Map<
  string,
  Map<string, UserInteraction[]>
>();

export async function trackUserInteraction(
  guildId: string,
  userId: string,
  username: string,
  interaction: UserInteraction,
): Promise<void> {
  const evaluationPeriod = 10 * 1000; // @FIXME change to 60

  let guildInteractions = trackedUserInteractions.get(guildId);

  if (!guildInteractions) {
    const newGuildInteractions = new Map<string, UserInteraction[]>();
    trackedUserInteractions.set(guildId, newGuildInteractions);

    guildInteractions = newGuildInteractions;
  }

  if (!guildInteractions.has(userId)) {
    guildInteractions.set(userId, []);
    setTimeout(async () => {
      await assignXp(guildId, userId, username);
      guildInteractions.delete(userId);
    }, evaluationPeriod);
  }

  trackedUserInteractions.get(guildId)?.get(userId)?.push(interaction);
}

async function assignXp(
  guildId: string,
  userId: string,
  username: string,
): Promise<void> {
  const interactions = trackedUserInteractions.get(guildId)?.get(userId);

  if (!interactions || interactions.length === 0) {
    return;
  }

  const xp = calculateXp(interactions);

  const userXp = database.getRepository(UserXp);

  let userXpEntry = await userXp.findOneBy({
    userId: userId,
    guildId: guildId,
  });

  if (!userXpEntry) {
    userXpEntry = new UserXp();

    userXpEntry.userId = userId;
    userXpEntry.guildId = guildId;
  }

  userXpEntry.username = username;
  userXpEntry.xp += xp;
  userXpEntry.messageCount += interactions.length;

  await userXp.save(userXpEntry);

  logger.info(`Assigned ${xp} XP to user ${userId} in guild ${guildId}`);
}

function calculateXp(interactions: UserInteraction[]): number {
  const base = 20;
  let bonus = 0;

  if (interactions.length < 4) {
    return base;
  }

  const totalLength = interactions.reduce(
    (sum, interaction) => sum + interaction.messageLength,
    0,
  );

  const averageLength = totalLength / interactions.length;

  if (averageLength < 40) {
    bonus -= base;
  } else if (averageLength < 100) {
    bonus -= base / 2;
  } else if (averageLength < 150) {
    bonus = 0;
  } else if (averageLength < 200) {
    bonus += base / 4;
  } else if (averageLength < 300) {
    bonus += base / 2;
  } else {
    bonus += base;
  }

  return base + bonus;
}
