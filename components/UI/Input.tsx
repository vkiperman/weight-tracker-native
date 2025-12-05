import React from 'react';
import {
	Platform,
	StyleProp,
	StyleSheet,
	TextInput,
	TextStyle,
} from 'react-native';
import { TextInputProps } from 'react-native/Libraries/Components/TextInput/TextInput';

interface Props extends React.Component<TextInputProps>, TextInputProps {
	style?: StyleProp<TextStyle>;
}

function Input({ style, ...props }: Partial<Props>) {
	return (
		<TextInput
			{...props}
			style={[styles.textInput, style]}
			keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'}
		/>
	);
}

export default Input;

const styles = StyleSheet.create({
	textInput: {
		fontFamily: 'Roboto_500Medium',
		borderWidth: 0,
		width: 55,
		borderColor: 'transparent',
		backgroundColor: 'white',
		borderRadius: 6,
		paddingBlock: 1,
		paddingInline: 8,
	},
});
