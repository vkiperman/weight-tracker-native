import { useContext } from 'react';
import { useChartData, useLineOfBestFit } from '../hooks/data';
import { WeightContext } from '../store/context/weight-context';

import {
	NavigationProp,
	useNavigation,
	useRoute,
} from '@react-navigation/native';
import React from 'react';
import {
	Pressable,
	PressableProps,
	StyleSheet,
	useWindowDimensions,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { chartConfig } from '../constants/chart';
import { RootStackParamList } from '../types/navigation.types';

interface Props extends PressableProps {
	children?: React.ReactNode;
}
function Chart() {
	const { width, height } = useWindowDimensions();
	const { weights } = useContext(WeightContext);
	const { labels, data } = useChartData(weights);
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const route = useRoute();

	const handleChartPress = () => {
		if (width < height) return;
		route.name === 'main'
			? navigation.navigate('chart')
			: navigation.goBack();
	};

	const bestFitData = useLineOfBestFit(weights);

	return (
		<Pressable onPress={handleChartPress}>
			<LineChart
				width={
					route.name === 'main' && width > height
						? width * 0.52
						: width - 30
				}
				height={width > height ? height - 100 : 250}
				style={styles.chart}
				yAxisSuffix=' lb'
				transparent={true}
				withShadow={false}
				data={{
					labels,
					datasets: [
						...(bestFitData.length > 0
							? [
									{
										data: bestFitData,
										strokeWidth: 1,
										withDots: false,
										strokeDashArray: [5, 4],
										color: () => `rgb(255 255 255 / .75)`,
									},
								]
							: []),
						{
							data,
							key: 'weight',
							strokeWidth: 3.5,
							withDots: false,
							color: o => `rgb(255 255 255 / 1)`,
						},
					],
					legend: ['Weight Tracker'],
				}}
				segments={2}
				chartConfig={chartConfig}
			/>
		</Pressable>
	);
}

export default Chart;

const styles = StyleSheet.create({
	chart: {
		// placeholder
	},
});
