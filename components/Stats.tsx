import React, { useContext, useMemo, useRef } from 'react';
import { PressableProps, StyleSheet, Text, View } from 'react-native';
import { WeightContext } from '../store/context/weight-context';
import {
	getAverage,
	getDailyPerformance,
	getHigh,
	getLow,
} from '../utils/data';

interface StatUI {
	title: string;
	stat: number;
	className: 'avg' | 'down' | 'up';
}

interface Props extends PressableProps {
	style: {};
}
function Stats({ style }: Props) {
	const { weights } = useContext(WeightContext);
	const stats = useMemo(
		() => ({
			Avg: getAverage(weights, 'y'),
			High: getHigh(weights, 'y'),
			Low: getLow(weights, 'y'),
			Daily: getDailyPerformance(weights),
		}),
		[weights]
	);

	const statsUI = useMemo(
		() =>
			Object.entries(stats).map<StatUI>(([key, stat]) => ({
				title: `${key}:`,
				stat,
				className: ['High', 'Low'].includes(key)
					? stats[key as keyof typeof stats] > stats.Avg
						? 'up'
						: 'down'
					: key === 'Daily'
						? stats.Daily >= 0
							? 'up'
							: 'down'
						: 'avg',
			})),
		[stats]
	);

	const indicators = useRef({
		up: '↑',
		down: '↓',
		avg: '\u2003',
	});

	return (
		<View style={[styles.main, style]}>
			<Text style={[styles.plainText, styles.header]}>Stats</Text>
			{statsUI.map(({ title, stat, className }, key) => (
				<View key={key} style={styles.stat}>
					<Text
						style={styles.plainText}
						ellipsizeMode='clip'
						numberOfLines={1}>
						{title}
					</Text>
					<Text style={styles[className]}>
						{stat.toFixed(2)}
						<Text>{indicators.current[className]}</Text>
					</Text>
				</View>
			))}
		</View>
	);
}

export default Stats;

export const styles = StyleSheet.create({
	main: {
		gap: 1,
	},
	header: {
		fontSize: 20,
		fontFamily: 'Roboto_800ExtraBold',
		marginBottom: 8,
	},
	stat: {
		justifyContent: 'space-between',
		gap: 0,
		marginRight: 8,
		flexDirection: 'row',
		width: 200,
		overflow: 'hidden',
	},
	up: {
		color: 'rgb(255, 168, 168)',
		fontFamily: 'Roboto_800ExtraBold',
	},
	down: {
		color: 'rgb(132, 255, 132)',
		fontFamily: 'Roboto_800ExtraBold',
	},
	avg: {
		color: 'rgb(255, 255, 255)',
		fontFamily: 'Roboto_800ExtraBold',
	},
	plainText: {
		color: 'rgb(255, 255, 255)',
		fontFamily: 'Roboto_800ExtraBold',
	},
	labelNone: {
		color: '#585858ff',
	},
});
