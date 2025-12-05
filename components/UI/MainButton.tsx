import {
	Pressable,
	PressableProps,
	PressableStateCallbackType,
	StyleSheet,
	Text,
} from 'react-native';

interface Props extends PressableProps {
	children: React.ReactNode;
	style?: {} | undefined | null;
}

function MainButton({ children, style, ...props }: Props) {
	const pressableStyles = ({ pressed }: PressableStateCallbackType) => [
		styles.pressabe,
		style,
		pressed ? styles.pressed : undefined,
	];
	return (
		<Pressable {...props} style={pressableStyles}>
			<Text style={styles.text}>{children}</Text>
		</Pressable>
	);
}

export default MainButton;

const styles = StyleSheet.create({
	pressabe: {
		backgroundColor: '#FFFFFF33',
		borderColor: '#FFFFFF66',
		borderRadius: 6,
		paddingBlock: 4,
		paddingInline: 8,
		borderWidth: 1,
		justifyContent: 'center',
	},
	text: {
		color: '#FFFFFF',
		fontWeight: '800',
		fontFamily: 'Roboto_600SemiBold',
		fontSize: 18,
	},
	pressed: {
		backgroundColor: '#404059ff',
		borderColor: '#8989c7ff',
		borderWidth: 1,
	},
});
