import { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart';

export const chartConfig: AbstractChartConfig = {
	backgroundGradientFrom: '#000',
	backgroundGradientFromOpacity: 1,
	backgroundGradientTo: '#000',
	backgroundGradientToOpacity: 1,
	color: o => `rgb(255 255 255 / ${o})`,
	labelColor: o => `rgb(255 255 255 / ${o})`,
	linejoinType: 'round',
	decimalPlaces: 1,
	scrollableDotFill: 'red',
	useShadowColorFromDataset: true,
	propsForBackgroundLines: {
		opacity: 0,
	},
};
