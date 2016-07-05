/**
 * Returns an array with exceptions for the sentence beginning researcher.
 * @returns {Array} The array filled with exceptions.
 */
module.exports = function() {
	return [
		// Definite articles:
		"le", "la", "les",
		// Indefinite articles:
		"un", "une",
		// Numbers 2-10 ('une' is already included in the indefinite articles):
		"deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix",
		// Demonstrative pronouns:
		"celui", "celle", "ceux", "celles", "celui-ci", "celle-là", "celui-là", "celle-ci"
	];
};

