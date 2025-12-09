import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';

import {
	Roboto_400Regular,
	Roboto_400Regular_Italic,
	Roboto_500Medium,
	Roboto_500Medium_Italic,
	Roboto_600SemiBold,
	Roboto_800ExtraBold,
	useFonts,
} from '@expo-google-fonts/roboto';
import { MaterialIcons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Chart from './components/Chart';
import Main from './screens/Main.Screen';
import WeightEntry from './screens/WeightEntry.Screen';
import WeightContextProvider from './store/context/weight-context';

// import { setItem } from 'expo-secure-store';

const { Navigator, Screen } = createNativeStackNavigator();

export default function App() {
	// setItem('weight-tracker', '[]');

	const [fontsLoaded] = useFonts({
		Roboto_400Regular,
		Roboto_400Regular_Italic,
		Roboto_500Medium,
		Roboto_500Medium_Italic,
		Roboto_600SemiBold,
		Roboto_800ExtraBold,
	});

	return (
		<>
			<StatusBar style='inverted' />
			<WeightContextProvider>
				<NavigationContainer>
					<Navigator
						screenOptions={{
							headerStyle: {
								backgroundColor: '#353548ff',
							},
							headerTitleStyle: {
								fontFamily: 'Roboto_600SemiBold',
								fontSize: 22,
							},
							contentStyle: {
								backgroundColor: '#000',
							},
							headerTintColor: '#FFFFFFEE',
						}}>
						<Screen
							component={Main}
							name='main'
							options={({ navigation }) => {
								return {
									title: 'GlowDown',
									headerRight: ({ tintColor }) => (
										<MaterialIcons
											size={22}
											color={tintColor}
											name='monitor-weight'
											onPress={() =>
												navigation.navigate(
													'weight-entry'
												)
											}
										/>
									),
								};
							}}
						/>
						<Screen
							component={WeightEntry}
							name='weight-entry'
							options={({ navigation }) => {
								return {
									title: 'Enter Weight',
								};
							}}
						/>
						<Screen
							component={Chart}
							name='chart'
							options={({ navigation }) => {
								return {
									title: 'Weights',
									animation: 'fade',
									headerRight: ({ tintColor }) => (
										<MaterialIcons
											size={22}
											color={tintColor}
											name='monitor-weight'
											onPress={() =>
												navigation.navigate(
													'weight-entry'
												)
											}
										/>
									),
								};
							}}
						/>
					</Navigator>
				</NavigationContainer>
			</WeightContextProvider>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	form: {
		flexDirection: 'row',
		width: '100%',
		// backgroundColor: '#999',
		justifyContent: 'center',
	},
	input: {
		borderColor: '#888',
		paddingBlock: 4,
		paddingInline: 8,
		borderWidth: 2,
		borderRadius: 5,
		width: 120,
	},
});
