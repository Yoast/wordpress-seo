import getStemForLanguage from "./getStemForLanguage";

/**
 * Checks which languages have morphology support inside YoastSEO.js.
 *
 * @returns {string[]} A list of languages that have morphology support.
 */
export default function() {
	return Object.keys( getStemForLanguage() );
}
