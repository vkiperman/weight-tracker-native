import { useNavigation, type NavigationProp } from '@react-navigation/native';
import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useProjection } from '../hooks/data';
import { WeightContext } from '../store/context/weight-context';
import { RootStackParamList } from '../types/navigation.types';
import { getFormattedDate } from '../utils/date';
import MainButton from './UI/MainButton';

interface Props {
	style: {};
}
function Snapshot({ style }: Props) {
	const { weights } = useContext(WeightContext);
	const projection = useProjection(weights);

	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const launchWeightEntry = () => navigation.navigate('weight-entry');
	return (
		<View style={[styles.main, style]}>
			<View>
				<Text style={[styles.textBase, styles.today]}>
					{getFormattedDate(new Date())}
				</Text>
			</View>

			<View style={styles.row}>
				<Text style={[styles.textBase, styles.lastWeight]}>
					Last Weigh-in:
				</Text>
				<MainButton onPress={launchWeightEntry}>
					{weights.at(-1)?.y!} lbs
				</MainButton>
				<Text style={[styles.textBase]}>
					{getFormattedDate(weights.at(-1)?.x!)}
				</Text>
			</View>
			<View style={styles.row}>
				<Text style={[styles.textBase, styles.today, styles.italic]}>
					Projection: Tomorrow's weight:{' '}
					<Text style={[styles.textBase, styles.bold, styles.italic]}>
						{projection.at(-1)?.y!} lbs
					</Text>
				</Text>
			</View>
		</View>
	);
}

export default Snapshot;
export const styles = StyleSheet.create({
	main: {
		gap: 7,
		alignItems: 'flex-start',
		justifyContent: 'center',
	},
	lastWeight: {
		fontFamily: 'Roboto_600SemiBold',
		fontSize: 18,
	},
	row: {
		flexDirection: 'row',
		gap: 8,
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	textBase: {
		color: '#FFFFFFBB',
		fontFamily: 'Roboto_400Regular',
	},
	bold: {
		fontFamily: 'Roboto_600SemiBold',
	},
	today: {
		opacity: 0.7,
	},
	italic: {
		fontFamily: 'Roboto_500Medium_Italic',
	},
});
