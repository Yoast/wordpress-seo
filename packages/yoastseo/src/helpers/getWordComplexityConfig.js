import wordComplexityConfigEnglish from "../languageProcessing/languages/en/config/wordComplexity.js";
import wordComplexityConfigGerman from "../languageProcessing/languages/de/config/wordComplexity.js";
import wordComplexityConfigSpanish from "../languageProcessing/languages/es/config/wordComplexity.js";
import wordComplexityConfigFrench from "../languageProcessing/languages/fr/config/wordComplexity.js";

/**
 * Gets the word complexity assessment's config.
 *
 * @param {string} language The researcher language.
 * @returns {function} The word complexity assessment's config.
 */
export default function getWordComplexityConfig( language ) {
	const configs = {
		de: wordComplexityConfigGerman,
		en: wordComplexityConfigEnglish,
		es: wordComplexityConfigSpanish,
		fr: wordComplexityConfigFrench,
	};
	return configs[ language ];
}
