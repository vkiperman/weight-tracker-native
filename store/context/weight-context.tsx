import { getItemAsync, setItemAsync } from 'expo-secure-store';
import { createContext, useCallback, useEffect, useState } from 'react';
import { Weight } from '../../types/weight.type';
import { getStartOfToday } from '../../utils/date';

const secureStoreItemName = 'weight-tracker';

interface IWeightContext {
	weights: Weight[];
	addWeight: (y: number) => void;
}
export const WeightContext = createContext<IWeightContext>({
	weights: [],
	addWeight: () => {},
});

function WeightContextProvider({
	children,
}: React.PropsWithChildren): React.JSX.Element {
	const [value, setValue] = useState<IWeightContext>({
		weights: [],
		addWeight: () => {},
	});

	const updateValue = useCallback(async () => {
		try {
			const stored = await getItemAsync(secureStoreItemName);
			const weights = JSON.parse(stored || '[]');
			setValue(value => ({ ...value, weights }));
		} catch (error) {
			console.error('Failed to load weights:', error);
		}
	}, []);

	useEffect(() => {
		const addWeight = async (y: number) => {
			const x = getStartOfToday();
			await setItemAsync(
				secureStoreItemName,
				JSON.stringify([
					...value.weights.filter(wt => wt.x !== x.toISOString()),
					{ x, y },
				])
			);
			updateValue();
		};
		setValue(value => ({ ...value, addWeight }));
	}, [value.weights]);

	// Load weights asynchronously after mount
	useEffect(() => {
		const loadWeights = async () => {
			// await setItemAsync(
			// 	secureStoreItemName,
			// 	`[
			// 	{"x": "${getStartOfOffsetDay(3).toISOString()}", "y": 200.9},
			// 	{"x": "${getStartOfOffsetDay(2).toISOString()}", "y": 200.5},
			// 	{"x": "${getStartOfOffsetDay().toISOString()}", "y": 200}]`
			// );
			await updateValue();
		};
		loadWeights();
	}, []);

	return (
		<WeightContext.Provider value={value}>
			{children}
		</WeightContext.Provider>
	);
}

export default WeightContextProvider;
