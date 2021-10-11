import { isFeatureEnabled } from "@yoast/feature-flag";
/**
 * Checks which languages have morphology support inside YoastSEO.js.
 *
 * @returns {string[]} A list of languages that have morphology support.
 */
export function getLanguagesWithWordFormSupport() {
	const supportedLanguages = [ "en", "de", "es", "fr", "it", "nl", "ru", "id", "pt", "pl", "ar", "sv", "he", "hu", "nb", "tr", "cs", "sk" ];

	// Add Japanese to the supported languages list if the feature is enabled.
	if ( isFeatureEnabled( "JAPANESE_SUPPORT" ) ) {
		supportedLanguages.push( "ja" );
	}

	// Add Greek to the supported languages list if the feature is enabled.
	if ( isFeatureEnabled( "GREEK_SUPPORT" ) ) {
		supportedLanguages.push( "el" );
	}

	return supportedLanguages;
}
