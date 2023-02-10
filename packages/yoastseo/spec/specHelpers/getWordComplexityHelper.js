import wordComplexityHelperGerman from "../../src/languageProcessing/languages/de/helpers/checkIfWordIsComplex";
import wordComplexityHelperEnglish from "../../src/languageProcessing/languages/en/helpers/checkIfWordIsComplex";
import wordComplexityHelperSpanish from "../../src/languageProcessing/languages/es/helpers/checkIfWordIsComplex";
import wordComplexityHelperFrench from "../../src/languageProcessing/languages/fr/helpers/checkIfWordIsComplex";

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
