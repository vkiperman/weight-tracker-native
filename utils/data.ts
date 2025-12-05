import { Weight } from '../types/weight.type';

/**
 * Linearly fills missing daily points between known dates.
 *
 * - Input can be unsorted and may have gaps of multiple days.
 * - For each consecutive pair of known points, it inserts daily points
 *   (exclusive of the left end, inclusive of the right end) with y interpolated linearly.
 * - No extrapolation beyond the earliest/latest known x.
 *
 * @param data Sparse array of {x: ISO string, y: number}
 * @param decimals Optional: round to this many decimals (default 1). Pass null to skip rounding.
 * @returns Dense, sorted array with daily points filled in.
 */
export function fillLinearDaily(data: Weight[], decimals = 1): Weight[] {
	if (!Array.isArray(data) || !data.length) return [];

	const DAY_MS = 24 * 60 * 60 * 1000;

	const roundMaybe = (v: number) =>
		decimals === null ? v : +v.toFixed(decimals);
	const toNum = (str: string) => +new Date(str);

	const seen = new Set<string>();

	// Normalize & sort by time ascending
	return [...data]
		.filter(p => Number.isFinite(toNum(p.x!)))
		.sort((a, b) => toNum(a.x!) - toNum(b.x!))
		.reduce((acc, cur, i, sorted) => {
			// Always push the first point (or the segment's right endpoint inside the loop)
			if (i === 0) {
				acc.push({ x: cur.x, y: roundMaybe(cur.y!) });
				return acc;
			}

			const prev = sorted[i - 1];

			// Compute whole-day gap between prev and cur (by milliseconds)
			const gapDays = Math.round(
				(toNum(cur.x!) - toNum(prev.x!)) / DAY_MS
			);

			if (gapDays < 1) {
				// Same day or out-of-order duplicate -> keep the latest point for that day
				acc[acc.length - 1] = {
					x: cur.x,
					y: roundMaybe(cur.y!),
				};
				return acc;
			}

			// If exactly next day, just push the current point (no interpolation needed)
			if (gapDays === 1) {
				acc.push({ x: cur.x, y: roundMaybe(cur.y!) });
				return acc;
			}

			// Interpolate days strictly between prev and cur
			for (let d = 1; d < gapDays; d++) {
				const ratio = d / gapDays;
				const x = new Date(toNum(prev.x!) + d * DAY_MS).toISOString();
				const y = roundMaybe(prev.y! + (cur.y! - prev.y!) * ratio);
				acc.push({ x, y });
			}

			// Finally push the right endpoint
			acc.push({ x: cur.x, y: roundMaybe(cur.y!) });
			return acc;
		}, [] as Weight[])
		.filter(p => !seen.has(p.x!) && seen.add(p.x!));
}

export function getAverage<T>(value: (number | T)[], prop?: keyof T): number {
	return value
		.map(o => (prop ? (o as T)[prop] : o) as number)
		.reduce(
			(acc, cur, i, src) =>
				src.length - 1 <= i ? (acc + cur) / (i + 1) : acc + cur,
			0
		);
}

export function getHigh<T>(value: (number | T)[], prop?: keyof T): number {
	return value
		.map(o => (prop ? (o as T)[prop] : o) as number)
		.reduce((acc, cur) => Math.max(acc, cur), 0);
}

export function getLow<T>(value: (number | T)[], prop?: keyof T): number {
	return value
		.map(o => (prop ? (o as T)[prop] : o) as number)
		.reduce((acc, cur, i) => (i ? Math.min(acc, cur) : cur), 0);
}

export function getDailyPerformance(data: Weight[] | null | undefined): number {
	const DAY = 1000 * 60 * 60 * 24;

	if (!data || data.length < 2) return 0;
	const first = data.at(0)!;
	const last = data.at(-1)!;

	const progress = last!.y! - first!.y!;
	const days = (+new Date(last.x!) - +new Date(first.x!)) / DAY;
	return progress / days;
}
