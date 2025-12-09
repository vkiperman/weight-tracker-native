import { useContext, useMemo } from 'react';
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
	ScrollView,
	StyleSheet,
	useWindowDimensions,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dataset } from 'react-native-chart-kit/dist/HelperTypes';
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

	const chartHeight = width > height ? height - 100 : 250;

	const mainDataset = useMemo<Dataset>(
		() => ({
			data,
			key: 'weight',
			strokeWidth: 3.5,
			withDots: false,
			color: () => `rgb(255 255 255 / 1)`,
		}),
		[data]
	);
	const lineOfBestFitDataset = useMemo<Dataset>(
		() => ({
			data: bestFitData,
			strokeWidth: 1,
			withDots: false,
			strokeDashArray: [5, 4],
			color: () => `rgb(255 255 255 / .75)`,
		}),
		[bestFitData]
	);

	return (
		<>
			<ScrollView
				contentContainerStyle={{
					width:
						route.name === 'main' && width > height
							? width * 0.52
							: width - 30,
					minHeight: chartHeight,
				}}
				horizontal
				showsHorizontalScrollIndicator={true}>
				<Pressable onPress={handleChartPress}>
					<LineChart
						width={Math.max(weights.length * 95, width)}
						height={chartHeight}
						yAxisSuffix=' lb'
						transparent={true}
						withShadow={false}
						data={{
							labels,
							datasets: [
								...(bestFitData.length > 0
									? [lineOfBestFitDataset]
									: []),
								mainDataset,
							],
							legend: ['Weights'],
						}}
						segments={2}
						chartConfig={chartConfig}
					/>
				</Pressable>
			</ScrollView>
		</>
	);
}

export default Chart;

const styles = StyleSheet.create({
	chart: {
		// placeholder
	},
});
