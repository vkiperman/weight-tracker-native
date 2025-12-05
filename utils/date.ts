export const dateFormatter = new Intl.DateTimeFormat(undefined, {
	weekday: 'short',
	year: 'numeric',
	month: 'short',
	day: 'numeric',
	// hour: '2-digit',
	// minute: '2-digit',
	// timeZone: 'America/Los_Angeles',
});

export function getStartOfToday(): Date {
	const now = new Date();
	return new Date(now.setHours(0, 0, 0, 0));
}

export function dateFormatString(dateString: string) {
	const { locale, timeZone } = Intl.DateTimeFormat().resolvedOptions();
	const dateFormatter = Intl.DateTimeFormat(
		Intl.getCanonicalLocales(locale),
		{
			weekday: 'short',
			year: '2-digit',
			month: '2-digit',
			day: '2-digit',
			timeZone,
		}
	);
	return getFormattedDate(dateString, dateFormatter).replace(', ', '\u2009');
}

export function getFormattedDate(
	dateString: string | Date | number,
	formatter = dateFormatter
) {
	return formatter.format(new Date(dateString));
}
