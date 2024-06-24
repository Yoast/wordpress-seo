import wordComplexityHelperGerman from "../languageProcessing/languages/de/helpers/checkIfWordIsComplex.js";
import wordComplexityHelperEnglish from "../languageProcessing/languages/en/helpers/checkIfWordIsComplex.js";
import wordComplexityHelperSpanish from "../languageProcessing/languages/es/helpers/checkIfWordIsComplex.js";
import wordComplexityHelperFrench from "../languageProcessing/languages/fr/helpers/checkIfWordIsComplex.js";

/**
 * Gets the word complexity assessment helper.
 *
 * @param {string} language The researcher language.
 * @returns {function} The word complexity assessment's helper.
 */
export default function getWordComplexityHelper( language ) {
	const helpers = {
		de: wordComplexityHelperGerman,
		en: wordComplexityHelperEnglish,
		es: wordComplexityHelperSpanish,
		fr: wordComplexityHelperFrench,
	};
	return helpers[ language ];
}
