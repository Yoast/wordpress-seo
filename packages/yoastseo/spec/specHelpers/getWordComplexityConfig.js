import wordComplexityConfigEnglish from "../../src/languageProcessing/languages/en/config/wordComplexity";
import wordComplexityConfigGerman from "../../src/languageProcessing/languages/de/config/wordComplexity";
import wordComplexityConfigSpanish from "../../src/languageProcessing/languages/es/config/wordComplexity";
import wordComplexityConfigFrench from "../../src/languageProcessing/languages/fr/config/wordComplexity";

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
