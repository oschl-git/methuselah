import { UserInteraction } from "./xpManager.js";

const MESSAGE_CAP = 200;
const ATTACHMENT_CREDIT = 30;
const CURVE_CAP = 35;
const CURVE_SCALE = 177; // tuned with CURVE_CAP so a normal minute of activity earns ~20 XP
const GOOD_AVERAGE_LENGTH = 60;
const MIN_SPAM_FACTOR = 0.3;

export function calculateXp(interactions: UserInteraction[]): number {
    if (interactions.length === 0) {
        return 0;
    }

    const totalUseful = interactions.reduce((sum, interaction) => sum + effectiveLength(interaction), 0);

    const contentXp = CURVE_CAP * (1 - Math.exp(-totalUseful / CURVE_SCALE));

    const averageUseful = totalUseful / interactions.length;
    const spamFactor = Math.min(Math.max(averageUseful / GOOD_AVERAGE_LENGTH, MIN_SPAM_FACTOR), 1);

    return Math.round(contentXp * spamFactor);
}

function effectiveLength(interaction: UserInteraction): number {
    const normalized = interaction.content
        .replace(/\s+/gu, " ")
        .replace(/(.)\1{2,}/gu, "$1$1$1") // collapse runs of a repeated character to three, so padding earns nothing
        .trim();

    const length = [...normalized].length;

    if (length === 0) {
        return interaction.hasAttachment ? ATTACHMENT_CREDIT : 0;
    }

    return Math.min(length, MESSAGE_CAP);
}
