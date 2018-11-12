import getFunctionWords from "./getFunctionWords";

/**
 * Checks which languages have function words support inside YoastSEO.js.
 *
 * @returns {string[]} A list of languages that have function words support.
 */
export default function() {
	const functionWords = getFunctionWords();

	return Object.keys( functionWords );
}
