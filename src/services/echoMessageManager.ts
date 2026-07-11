import * as userState from "../services/userState.js";

interface EchoMessageEntry {
    userId: string;
    channelId: string;
    timeout: ReturnType<typeof setTimeout>;
}

export const echoMessageTimeout = 60;

const awaitingEchoMessages: EchoMessageEntry[] = [];

export function addEntry(userId: string, channelId: string): void {
    userState.blockUserInteraction(userId);

    const timeout = setTimeout(() => removeEntry(userId, channelId), echoMessageTimeout * 1000);

    awaitingEchoMessages.push({ userId, channelId, timeout });
}

export function removeEntry(userId: string, channelId: string): void {
    const index = awaitingEchoMessages.findIndex((entry) => entry.userId === userId && entry.channelId === channelId);

    if (index !== -1) {
        clearTimeout(awaitingEchoMessages[index].timeout);
        awaitingEchoMessages.splice(index, 1);
    }

    userState.unblockUserInteraction(userId);
}

export function isAwaitingEchoMessage(userId: string, channelId: string): boolean {
    return awaitingEchoMessages.some((entry) => entry.userId === userId && entry.channelId === channelId);
}
