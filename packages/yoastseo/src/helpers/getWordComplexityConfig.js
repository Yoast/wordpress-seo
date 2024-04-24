import wordComplexityConfigEnglish from "../languageProcessing/languages/en/config/wordComplexity";
import wordComplexityConfigGerman from "../languageProcessing/languages/de/config/wordComplexity";
import wordComplexityConfigSpanish from "../languageProcessing/languages/es/config/wordComplexity";
import wordComplexityConfigFrench from "../languageProcessing/languages/fr/config/wordComplexity";

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
