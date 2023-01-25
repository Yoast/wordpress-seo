import { flatten, uniq } from "lodash-es";

/**
 * Checks if the word matches any paradigm and creates the forms from the matched paradigm(s).
 * If no matches found, returns an array with the original word.
 *
 * @param {string}  word            The word to check.
 * @param {Object}  morphologyData  The morphology data.
 *
 * @returns {Array} The array of created forms.
 */
function createForms( word, morphologyData ) {
	const paradigmEndingsGroups = morphologyData.paradigmGroups;

	// The endings in the array are sorted from the longest to the shortest.
	// This way, if there are multiple matches, the first element in the matched array is always the longest one.
	let allEndings = uniq( flatten( paradigmEndingsGroups ) );
	allEndings = allEndings.sort( ( a, b ) => b.length - a.length || a.localeCompare( b ) );

	// Check if the word matches any ending(s) and save the ending(s).
	const matchedEndings = allEndings.filter( ending => word.endsWith( ending ) );

	const forms = [];

	if ( matchedEndings.length === 0 ) {
		// If there is no match found, add the original word to the forms array.
		forms.push( word );
	} else {
		// Pick the longest ending.
		const matchedEnding = matchedEndings[ 0 ];

		// Extract the stem.
		const matchedStem = word.slice( 0, -matchedEnding.length );

		// Loop over each endings group in the endings group array.
		for ( const endingsGroup of paradigmEndingsGroups ) {
			// Check if the ending of the matched word can be found in the endings group and create all the forms with all the endings in the group.
			if ( endingsGroup.includes( matchedEnding ) ) {
				forms.push( endingsGroup.map( ending => matchedStem + ending ) );
			}
		}
	}

	// If the final character of the input word ends in る, also create an extra form where the character is removed.
	const ruEnding = "る";
	if ( word.endsWith( ruEnding ) ) {
		forms.push( word.slice( 0, -ruEnding.length ) );
	}

	return uniq( flatten( forms ) );
}

/**
 * Creates forms for Japanese word.
 *
 * @param {string}  word            The word to check. Assume that the input word is a segment as outputted from `getContentWords` helper.
 * @param {Object}  morphologyData  The morphology data.
 *
 * @returns {Array} The array of created forms.
 */
export default function( word, morphologyData ) {
	// Check if the word is longer than 1 character.
	if ( word.length <= 1 ) {
		return [ word ];
	}

	return createForms( word, morphologyData );
}
