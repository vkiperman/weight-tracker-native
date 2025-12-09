import { useWindowDimensions } from 'react-native';
import { Weight } from '../types/weight.type';
import { fillLinearDaily } from '../utils/data';
import { dateFormatString } from '../utils/date';

export function useChartData(weights: Weight[]) {
	const { width, height } = useWindowDimensions();
	const data = fillLinearDaily(weights);
	return {
		labels: data.map(({ x }) => dateFormatString(x)),
		data: data.map(({ y }) => +y.toFixed(1)),
	};
}

export function useLineOfBestFit(weights: Weight[]): number[] {
	const data = fillLinearDaily(weights);

	if (data.length === 1) {
		// throw new Error('Need at least 2 points to compute a best-fit line.');
		return [data[0].y, data[0].y];
	}

	// Numeric x and y arrays
	const { xs, ys } = data.reduce<{ xs: number[]; ys: number[] }>(
		({ xs, ys }, { x, y }) => ({
			xs: [...xs, new Date(x).getTime()],
			ys: [...ys, y!],
		}),
		{ xs: [], ys: [] }
	);

	const n = data.length;

	// Means
	const getSum = (sum: number, val: number) => sum + val;
	const meanX = xs.reduce(getSum, 0) / n;
	const meanY = ys.reduce(getSum, 0) / n;

	// Slope (m) and intercept (b)
	let numerator = 0,
		denominator = 0;
	for (let i = 0; i < n; i++) {
		const dx = xs[i] - meanX;
		numerator += dx * (ys[i] - meanY);
		denominator += dx * dx;
	}
	const m = numerator / denominator;
	const b = meanY - m * meanX;

	// Generate y-values for each original x
	const linePoints = xs.map(x => ({
		x: new Date(x).toISOString(),
		y: m * x + b,
		n: (m * x + b).toFixed(1),
	}));

	return linePoints.map(({ y }) => +y.toFixed(1));
}

export function useProjection(data: Weight[], projectionSampleSize = 10) {
	const DAY = 24 * 60 * 60 * 1000;

	function regress(
		xs: number[],
		ys: number[]
	): { m: number; b: number; ok: boolean } {
		const n = xs.length;
		if (n < 2) return { m: 0, b: ys[n - 1], ok: false };

		const meanX = xs.reduce((a, b) => a + b, 0) / n;
		const meanY = ys.reduce((a, b) => a + b, 0) / n;

		let num = 0;
		let den = 0;
		for (let i = 0; i < n; i++) {
			const dx = xs[i] - meanX;
			num += dx * (ys[i] - meanY);
			den += dx * dx;
		}

		if (den === 0) return { m: 0, b: ys[n - 1], ok: false }; // all xs identical
		const m = num / den;
		return { m, b: meanY - m * meanX, ok: true };
	}

	return fillLinearDaily(data)
		.map((_, i) => {
			const start = Math.max(0, i - projectionSampleSize + 1);
			const window = data.slice(start, i + 1);

			const xs = window.map(d => new Date(d.x!).getTime());
			const ys = window.map(({ y }) => y);

			let nextT: number;
			if (xs.length >= 2) {
				const last = xs[xs.length - 1];
				const prev = xs[xs.length - 2];
				const gap = Math.max(DAY, last - prev || DAY); // avoid zero/negative gap
				nextT = last + gap;
				// } else if (xs.length === 1) {
				//   nextT = xs[0] + DAY;
			} else {
				return data[i];
			}

			const { m, b, ok } = regress(xs as number[], ys as number[]);
			const yhat = ok ? +(m * nextT + b).toFixed(1) : ys[ys.length - 1];

			return { x: new Date(nextT).toUTCString(), y: yhat ?? null };
		})
		.filter(
			({ x }, i, src) => i === src.length - 1 || +x! < +src[i + 1]?.x!
		);
}
