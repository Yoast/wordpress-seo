/**
 * Returns an array with exceptions for the sentence beginning researcher.
 * @returns {Array} The array filled with exceptions.
 */
export default function() {
	return [
		// Indefinite articles:
		"sebuah", "seorang", "sang", "si",
		// Numbers 1-10:
		"satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan",
		"sepuluh", "sebelas", "seratus", "seribu", "sejuta", "semiliar", "setriliun",
		// Demonstrative pronouns:
		"ini", "itu", "hal", "ia",
	];
}
