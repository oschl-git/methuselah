import * as userState from "../services/userState.js";

interface AwaitingPermaMessageEntry {
  userId: string;
  channelId: string;
}

export const awaitingPermaMessageTimeout = 60;

const awaitingPermaMessages: AwaitingPermaMessageEntry[] = [];

export function addEntry(userId: string, channelId: string): void {
  userState.blockUserInteraction(userId);

  awaitingPermaMessages.push({ userId, channelId });

  setTimeout(
    () => removeEntry(userId, channelId),
    awaitingPermaMessageTimeout * 1000,
  );
}

export function removeEntry(userId: string, channelId: string): void {
  const index = awaitingPermaMessages.findIndex(
    (entry) => entry.userId === userId && entry.channelId === channelId,
  );

  if (index !== -1) {
    awaitingPermaMessages.splice(index, 1);
  }

  userState.unblockUserInteraction(userId);
}

export function isAwaitingPermaMessage(
  userId: string,
  channelId: string,
): boolean {
  return awaitingPermaMessages.some(
    (entry) => entry.userId === userId && entry.channelId === channelId,
  );
}
