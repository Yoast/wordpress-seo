export default function() {
	return [
		// Whitespace is always a word boundary.
		" ", "\\n", "\\r", "\\t",
		// NO-BREAK SPACE.
		"\u00a0",
		// \u06d4 - Urdu full stop
		"\u06d4",
		// \u061f - Arabic question mark
		"\u061f",
		// \u060C - Arabic comma
		"\u060C",
		// \u061B - Arabic semicolon
		"\u061B",
		" ",

		".", ",", "'", "(", ")", "\"", "+", "-", ";", "!", "?", ":", "/", "»", "«", "‹", "›", "<", ">" ];
};
