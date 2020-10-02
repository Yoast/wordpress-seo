/**
 * The function returning an array containing transliteration objects, based on the given locale.
 *
 * @see https://en.wikipedia.org/wiki/English_terms_with_diacritical_marks https://en.wikipedia.org/wiki/English_orthography
 * @param {string} locale The locale.
 * @returns {Array} An array containing transliteration objects.
 */
export default function() {
	return [
		{ letter: /[\u00E6\u04D5]/g, alternative: "ae" },
		{ letter: /[\u00C6\u04D4]/g, alternative: "Ae" },
		{ letter: /[\u0153]/g, alternative: "oe" },
		{ letter: /[\u0152]/g, alternative: "Oe" },
		{ letter: /[\u00EB\u00E9]/g, alternative: "e" },
		{ letter: /[\u00C9\u00CB]/g, alternative: "E" },
		{ letter: /[\u00F4\u00F6]/g, alternative: "o" },
		{ letter: /[\u00D4\u00D6]/g, alternative: "O" },
		{ letter: /[\u00EF]/g, alternative: "i" },
		{ letter: /[\u00CF]/g, alternative: "I" },
		{ letter: /[\u00E7]/g, alternative: "c" },
		{ letter: /[\u00C7]/g, alternative: "C" },
		{ letter: /[\u00F1]/g, alternative: "n" },
		{ letter: /[\u00D1]/g, alternative: "N" },
		{ letter: /[\u00FC]/g, alternative: "u" },
		{ letter: /[\u00DC]/g, alternative: "U" },
		{ letter: /[\u00E4]/g, alternative: "a" },
		{ letter: /[\u00C4]/g, alternative: "A" }
	];
};
