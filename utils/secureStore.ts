import * as SecureStore from 'expo-secure-store';

export async function removeItem(key: string) {
	return await SecureStore.deleteItemAsync(key);
}
