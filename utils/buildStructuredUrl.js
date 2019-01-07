/* External dependencies */
import { isArray } from "lodash";

/**
 * Builds a URL based on a string that has variables surrounded by % characters, like so:
 *
 * https://www.example.com/%category%/%postname%/
 *
 * The variables should correspond to a key in the urlParts object. The urlParts
 * key values can be either a string or an array. In case of an array, the parts
 * will be joined together using a slash. The variable is then replaced by the
 * url part's content. Example:
 *
 * urlParts: { category: [ "transportation", "flying" ], postname: "the-cost-of-flying" }
 * urlStructure = "https://www.example.com/%category%/%postname%"/
 *
 * Outputs: https://www.example.com/transportation/flying/the-cost-of-flying
 *
 * @param {string} urlStructure The URL structure.
 * @param {object} urlParts     The URL parts.
 *
 * @returns {string} The structured URL.
 */
export default function buildStructuredUrl( urlStructure, urlParts = {} ) {
	// Get the URL parts keys.
	const partIds = Object.keys( urlParts );

	let url = urlStructure;

	partIds.forEach( partId => {
		const part = urlParts[ partId ];

		// Get the replacement string: if it's an array, join the values with a slash.
		const replacement = isArray( part ) ? part.join( "/" ) : part;

		// Build a string representing the URL structure variable to be replaced.
		const variable = `%${ partId }%`;

		// Replace the URL structure variable with the replacement string.
		url = url.replace( new RegExp( variable, "g" ), replacement );
	} );

	return url;
}
