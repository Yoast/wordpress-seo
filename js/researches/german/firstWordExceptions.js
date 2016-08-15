/**
 * Returns an array with exceptions for the sentence beginning researcher.
 * @returns {Array} The array filled with exceptions.
 */
module.exports = function() {
	return [
		// Definite articles:
		"das", "dem", "den", "der", "des", "die",
		// Indefinite articles:
		"ein", "eine", "einem", "einen", "einer", "eines",
		// Numbers 1-10:
		"eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn",
		// Demonstrative pronouns:
		"denen", "deren", "derer", "dessen", "diese", "diesem", "diesen", "dieser", "dieses", "jene",
		"jenem", "jenen", "jener", "jenes",
	];
};


