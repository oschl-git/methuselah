interface EchoMessageEntry {
  userId: string;
  channelId: string;
}

export const echoMessageTimeout = 60;

const awaitingEchoMessages: EchoMessageEntry[] = [];

export function addEntry(userId: string, channelId: string): void {
  awaitingEchoMessages.push({ userId, channelId });

  setTimeout(() => removeEntry(userId, channelId), echoMessageTimeout * 1000);
}

export function removeEntry(userId: string, channelId: string): void {
  const index = awaitingEchoMessages.findIndex(
    (entry) => entry.userId === userId && entry.channelId === channelId,
  );

  if (index !== -1) {
    awaitingEchoMessages.splice(index, 1);
  }
}

export function isAwaitingEchoMessage(
  userId: string,
  channelId: string,
): boolean {
  return awaitingEchoMessages.some(
    (entry) => entry.userId === userId && entry.channelId === channelId,
  );
}
