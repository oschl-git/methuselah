import * as emojiLoader from "./emojiLoader.js";
import * as levelCalculator from "./levelCalculator.js";
import * as xpCalculator from "./xpCalculator.js";
import client from "./client.js";
import database from "../data/database.js";
import logger from "./logger.js";
import UserXp from "../data/entities/UserXp.js";

export interface UserInteraction {
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
  const evaluationPeriod = 60 * 1000;

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

  const xp = xpCalculator.calculateXp(interactions);

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

  const previousLevel = levelCalculator.calculateLevel(userXpEntry.xp);

  userXpEntry.username = username;
  userXpEntry.xp += xp;
  userXpEntry.messageCount += interactions.length;

  await userXp.save(userXpEntry);

  const newLevel = levelCalculator.calculateLevel(userXpEntry.xp);

  if (newLevel > previousLevel) {
    sendLevelUpNotification(guildId, userId, newLevel);
  }

  logger.info(`Assigned ${xp} XP to user ${userId} in guild ${guildId}`);
}

async function sendLevelUpNotification(
  guildId: string,
  userId: string,
  newLevel: number,
): Promise<void> {
  const user = await client.users.fetch(userId);
  const guild = await client.guilds.fetch(guildId);

  const emoji = await emojiLoader.tryGetEmojiString("methuselah");

  user.send(
    `*${emoji} ${user}, you have advanced to **level ${newLevel}** in the **${guild.name}** community. ` +
      `Another step of your journey is behind you.*`,
  );
}
