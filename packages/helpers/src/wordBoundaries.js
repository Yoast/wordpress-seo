/**
 * Retrieves a list that identify characters that break a word.
 *
 * @returns {string[]} List of word boundaries.
 */
export default function() {
	return [
		// Whitespace is always a word boundary.
		" ", "\\n", "\\r", "\\t",
		// NO-BREAK SPACE.
		"\u00a0",
		" ",

		".", ",", "'", "(", ")", "\"", "+", "-", ";", "!", "?", ":", "/", "»", "«", "‹", "›", "<", ">",
	];
}
