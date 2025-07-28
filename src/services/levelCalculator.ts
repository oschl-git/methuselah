export function calculateLevel(xp: number): number {
	let low = 0;
	let high = 10000;

	while (low < high) {
		const mid = Math.floor((low + high) / 2);
		const totalXP = getTotalXpForLevel(mid);

		if (totalXP > xp) {
			high = mid;
		} else {
			low = mid + 1;
		}
	}

	return low - 1;
}

export function getTotalXpForLevel(level: number): number {
	let xp = 0;
	for (let i = 0; i < level; i++) {
		xp += 5 * i ** 2 + 50 * i + 100;
	}
	return xp;
}
