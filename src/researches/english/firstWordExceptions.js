/**
 * Returns an array with exceptions for the sentence beginning researcher.
 * @returns {Array} The array filled with exceptions.
 */
module.exports = function() {
	return [
		// Definite articles:
		"the",
		// Indefinite articles:
		"a", "an",
		// Numbers 1-10:
		"one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
		// Demonstrative pronouns:
		"this", "that", "these", "those",
	];
};
