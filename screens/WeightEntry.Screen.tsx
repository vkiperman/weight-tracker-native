import { ParamListBase } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Input from '../components/UI/Input';
import MainButton from '../components/UI/MainButton';
import { WeightContext } from '../store/context/weight-context';

function WeightEntry({
	navigation,
}: React.PropsWithChildren<{
	navigation: NativeStackNavigationProp<ParamListBase, string, undefined>;
}>) {
	const { addWeight, weights } = useContext(WeightContext);
	const [weight, setWeight] = useState<string | undefined>(
		`${weights.at(-1)?.y! || ''}`
	);

	const handleSave = () => {
		addWeight(+weight!);
		// handle save
		navigation.goBack();
	};
	const handleInputChanges = (weight: string) => {
		setWeight(weight);
	};
	return (
		<View style={styles.main}>
			<View style={styles.content}>
				<View style={styles.form}>
					<Text style={[styles.textBase]}>Enter Weight</Text>
					<View style={styles.row}>
						<Input
							placeholder='195'
							onChangeText={handleInputChanges}
							value={weight}
						/>
						<MainButton onPress={handleSave} disabled={!weight}>
							Save
						</MainButton>
					</View>
				</View>
			</View>
		</View>
	);
}

export default WeightEntry;

export const styles = StyleSheet.create({
	main: {
		flex: 1,
		padding: 18,
		alignItems: 'center',
		justifyContent: 'center',
	},
	content: {
		gap: 8,
	},
	form: {
		// flexDirection: 'row',
		gap: 6,
		justifyContent: 'center',
		alignItems: 'flex-start',
		backgroundColor: 'transparent',
		borderColor: '#FFFFFFBB',
		borderCurve: 'circular',
		borderWidth: 1,
		borderRadius: 12,
		padding: 12,
		transform: 'scale(1.5)',
	},
	row: {
		flexDirection: 'row',
		gap: 8,
	},
	textBase: {
		color: '#FFFFFFBB',
		fontFamily: 'Roboto_400Regular',
	},
});
