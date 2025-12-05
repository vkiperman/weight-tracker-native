import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../types/navigation.types';
import MainButton from './UI/MainButton';

function Welcome() {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const launchWeightEntry = () => navigation.navigate('weight-entry');
	return (
		<View style={styles.welcome}>
			<Text style={styles.headerText}>Welcome!</Text>
			<Text style={styles.mainText}>
				Your weight tracking journey{'\n'}starts now!
			</Text>
			<Text style={styles.mainText}>Make your first weight entry.</Text>
			<MainButton onPress={launchWeightEntry} style={styles.mainButton}>
				Get Started!
			</MainButton>
		</View>
	);
}

export default Welcome;

const styles = StyleSheet.create({
	headerText: {
		fontWeight: '800',
		color: '#FFFFFFEE',
		fontSize: 26,
		fontFamily: 'Roboto_600SemiBold',
	},
	mainText: {
		color: '#FFFFFFEE',
		fontSize: 18,
		fontFamily: 'Roboto_400Regular',
		textAlign: 'center',
	},
	welcome: {
		alignItems: 'center',
		// justifyContent: 'center',
		padding: 20,
		borderRadius: 8,
		borderColor: '#FFFFFFAA',
		borderWidth: 3,
		gap: 7,
		margin: 15,
	},
	mainButton: {
		marginTop: 14,
	},
});
