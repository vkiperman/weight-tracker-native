import React, { useCallback, useContext } from 'react';
import {
	ScrollView,
	StyleSheet,
	useWindowDimensions,
	View,
} from 'react-native';
import Chart from '../components/Chart';
import Diff from '../components/Diff';
import Snapshot from '../components/Snapshot';
import Stats from '../components/Stats';
import Welcome from '../components/Welcome';
import { WeightContext } from '../store/context/weight-context';

function Main() {
	const { weights } = useContext(WeightContext);
	const { width, height } = useWindowDimensions();
	const isLandscape = useCallback(
		(obj?: {}) => width > height && obj,
		[width, height]
	);

	const mainStyle = [styles.main, isLandscape(styles.row)];
	const chartViewStyle = [
		weights.length ? styles.item : { width: '100%' },
		isLandscape([styles.hor, styles.lastItem]),
	];
	const snapshotStyle = [styles.item, weights.length > 1 || styles.lastItem];

	return (
		<View style={mainStyle}>
			<View style={chartViewStyle}>
				{weights.length ? <Chart /> : <Welcome />}
			</View>

			{!!weights.length && (
				<ScrollView style={styles.scrollView}>
					<Snapshot style={snapshotStyle} />
					{weights.length > 1 && <Diff style={styles.item} />}
					{weights.length > 1 && (
						<Stats style={[styles.item, styles.lastItem]} />
					)}
				</ScrollView>
			)}
			{/* <Text style={styles.text}>{JSON.stringify(weights)}</Text> */}
		</View>
	);
}

export default Main;

const styles = StyleSheet.create({
	main: {
		flex: 1,
		paddingBlock: 10,
		paddingInline: 15,
		gap: 0,
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
	},
	scrollView: {
		flex: 1,
		width: '100%',
		paddingBlock: 0,
	},
	text: {
		color: 'white',
		fontFamily: 'Courier New',
	},
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
	},
	welcome: {
		alignItems: 'center',
		justifyContent: 'center',
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
	row: {
		flexDirection: 'row',
	},
	item: {
		borderBottomColor: 'rgba(255, 255, 255, .5)',
		borderBottomWidth: 1,
		width: '100%',
		paddingBottom: 14,
		marginBottom: 14,
	},
	hor: {
		width: '55%',
	},
	lastItem: {
		borderBottomWidth: 0,
	},
});
