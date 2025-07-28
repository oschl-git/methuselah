import { UserInteraction } from './xpManager.js';

export function calculateXp(interactions: UserInteraction[]): number {
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
