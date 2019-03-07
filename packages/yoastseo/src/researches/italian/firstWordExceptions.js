/**
 * Returns an array with exceptions for the sentence beginning researcher.
 * @returns {Array} The array filled with exceptions.
 */
export default function() {
	return [
		// Definite articles:
		"il", "lo", "la", "i", "gli", "le",
		// Indefinite articles:
		"uno", "un", "una",
		// Numbers 1-10 ('uno' is already included above):
		"due", "tre", "quattro", "cinque", "sei", "sette", "otto", "nove", "dieci",
		// Demonstrative pronouns:
		"questo", "questa", "quello", "quella", "questi", "queste", "quelli", "quelle", "codesto", "codesti", "codesta",
		"codeste",
	];
}


