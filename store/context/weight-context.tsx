import { getItemAsync, setItemAsync } from 'expo-secure-store';
import { createContext, useEffect, useState } from 'react';
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

	// Load weights asynchronously after mount
	useEffect(() => {
		const loadWeights = async () => {
			try {
				const stored = await getItemAsync(secureStoreItemName);
				const weights = JSON.parse(stored || '[]');
				setValue(v => ({ ...v, weights }));
			} catch (error) {
				console.error('Failed to load weights:', error);
			}
		};
		loadWeights();
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
			const weights = JSON.parse(
				(await getItemAsync(secureStoreItemName)) || '[]'
			);
			setValue(value => ({
				...value,
				weights,
			}));
			console.log(2, weights);
		};
		setValue(value => ({ ...value, addWeight }));
	}, []);

	return (
		<WeightContext.Provider value={value}>
			{children}
		</WeightContext.Provider>
	);
}

export default WeightContextProvider;
