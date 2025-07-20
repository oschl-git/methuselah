import * as userState from "../services/userState.js";

interface EditMessageEntry {
  userId: string;
  channelId: string;
  messageId: string;
}

export const editMessageTimeout = 60;

const awaitingEdits: EditMessageEntry[] = [];

export function addEntry(
  userId: string,
  channelId: string,
  messageId: string,
): void {
  userState.blockUserInteraction(userId);

  awaitingEdits.push({ userId, channelId, messageId });

  setTimeout(
    () => removeEntry(userId, channelId, messageId),
    editMessageTimeout * 1000,
  );
}

export function removeEntry(
  userId: string,
  channelId: string,
  messageId: string,
): void {
  const index = awaitingEdits.findIndex(
    (entry) =>
      entry.userId === userId &&
      entry.channelId === channelId &&
      entry.messageId === messageId,
  );

  if (index !== -1) {
    awaitingEdits.splice(index, 1);
  }

  userState.unblockUserInteraction(userId);
}

export function getMessageIdForEdit(
  userId: string,
  channelId: string,
): string | null {
  const awaitingEdit = awaitingEdits.find(
    (entry) => entry.userId === userId && entry.channelId === channelId,
  );

  return awaitingEdit ? awaitingEdit.messageId : null;
}
