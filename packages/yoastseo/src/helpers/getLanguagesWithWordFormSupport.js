const supportedLanguages = [ "en", "de", "es", "fr", "it", "nl", "ru", "id", "pt", "pl", "ar", "sv", "he", "hu", "nb", "tr", "cs", "sk" ];

/**
 * Checks which languages have morphology support inside YoastSEO.js.
 *
 * @returns {string[]} A list of languages that have morphology support.
 */
export function getLanguagesWithWordFormSupport() {
	return supportedLanguages;
}
