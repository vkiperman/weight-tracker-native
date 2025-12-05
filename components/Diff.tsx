import { useCallback, useContext, useMemo, useRef } from 'react';
import { PressableProps, StyleSheet, Text, View } from 'react-native';
import { WeightContext } from '../store/context/weight-context';
import { fillLinearDaily } from '../utils/data';

interface Props extends PressableProps {
	style: {};
}
interface IDiff {
	value: number | string;
	className: 'none' | 'down' | 'up';
}
function Diff({ style }: Props) {
	const { weights } = useContext(WeightContext);

	const getDiff = useCallback(
		(dist: number = new Date().getDate() + 1): IDiff => {
			const dataPoints = fillLinearDaily(weights);
			let value: number =
				dataPoints.at(-1)?.y! - dataPoints.at(-dist - 1)?.y!;
			const badVal = isNaN(value);
			return {
				value: badVal ? 0 : Math.abs(value).toFixed(2),
				className: badVal ? 'none' : value <= 0 ? 'down' : 'up',
			};
		},
		[weights]
	);

	const diffs = useMemo(
		() => [
			{
				diff: getDiff(1),
				title: 'One day diff:',
			},
			{
				diff: getDiff(7),
				title: 'One week diff:',
			},
			{
				diff: getDiff(14),
				title: 'Two week diff:',
			},
			{
				diff: getDiff(21),
				title: 'Three week diff:',
			},
			{
				diff: getDiff(),
				title: 'Month to date diff:',
			},
			{
				diff: getDiff(weights.length - 1),
				title: 'Total diff:',
			},
		],
		[getDiff, weights]
	);

	const indicators = useRef({
		up: '↑',
		down: '↓',
		none: ' ',
	});

	return (
		<View style={[styles.main, style]}>
			<Text style={[styles.header]}>Trends</Text>
			{diffs.map((item, key) => (
				<View key={key} style={styles.diff}>
					<Text
						style={[
							styles[item.diff.className],
							item.diff.className === 'none' && styles.labelNone,
						]}>
						{item.title}
					</Text>
					<Text style={[styles[item.diff.className]]}>
						{item.diff.value}
						{indicators.current[item.diff.className]}
					</Text>
				</View>
			))}
		</View>
	);
}

export default Diff;

const styles = StyleSheet.create({
	main: {
		gap: 1,
	},
	diff: {
		justifyContent: 'space-between',
		gap: 8,
		marginRight: 8,
		flexDirection: 'row',
		width: 200,
	},
	header: {
		fontSize: 20,
		color: 'rgb(255, 255, 255)',
		fontFamily: 'Roboto_800ExtraBold',
		marginBottom: 8,
	},
	up: {
		color: 'rgb(255, 168, 168)',
		fontFamily: 'Roboto_800ExtraBold',
	},
	down: {
		color: 'rgb(132, 255, 132)',
		fontFamily: 'Roboto_800ExtraBold',
	},
	none: {
		color: 'transparent',
		fontFamily: 'Roboto_800ExtraBold',
	},
	labelNone: {
		color: '#585858ff',
	},
});
