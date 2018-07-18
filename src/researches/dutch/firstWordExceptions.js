/**
 * Returns an array with exceptions for the sentence beginning researcher.
 * @returns {Array} The array filled with exceptions.
 */
module.exports = function() {
	return [
		// Definite articles:
		"de", "het",
		// Indefinite articles:
		"een",
		// Numbers 1-10:
		"één", "eén", "twee", "drie", "vier", "vijf", "zes", "zeven", "acht", "negen", "tien",
		// Demonstrative pronouns:
		"dit", "dat", "die", "deze",
	];
};
