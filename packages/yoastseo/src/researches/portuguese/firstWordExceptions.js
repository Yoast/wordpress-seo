/**
 * Returns an array with exceptions for the sentence beginning researcher.
 * @returns {Array} The array filled with exceptions.
 */
export default function() {
	return [
		// Definite articles:
		"o", "a", "os", "as",
		// Indefinite articles:
		"um", "uma", "uns", "umas",
		// Numbers 1-10:
		"um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez",
		// Demonstrative pronouns:
		"este", "estes", "esta", "estas", "esse", "esses", "essa", "essas", "aquele",
		"aqueles", "aquela", "aquelas", "isto", "isso", "aquilo" ];
}
