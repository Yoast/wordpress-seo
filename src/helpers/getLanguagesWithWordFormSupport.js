import getFormsForLanguage from "./getFormsForLanguage";

/**
 * Checks which languages have morphology support inside YoastSEO.js.
 *
 * @returns {string[]} A list of languages that have morphology support.
 */
export default function() {
	return Object.keys( getFormsForLanguage() );
}
