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
	// The paradigm endings are sorted from the longest to the shortest. This way, if there are any overlapping endings,
	// The longest ending would be matched first.
	const allParadigmsRegex = new RegExp( morphologyData.allParadigms );
	const paradigmEndingsGroups = morphologyData.paradigmGroups;

	// Check if the word matches any paradigm.
	const matchedWord = allParadigmsRegex.exec( word );
	let forms;

	if ( matchedWord === null ) {
		forms = [ word ];
	} else {
		const matchedStem = matchedWord[ 1 ];
		const matchedEnding = matchedWord[ 2 ];

		for ( const endingsGroup of paradigmEndingsGroups ) {
			if ( endingsGroup.includes( matchedEnding ) ) {
				forms = endingsGroup.map( ending => matchedStem + ending );
			}
		}
	}

	// If the final character of the input word ends in る, also create an extra form where the character is removed.
	const ruEnding = "る";
	if ( word.endsWith( ruEnding ) ) {
		forms.push( word.slice( 0, -ruEnding.length ) );
	}

	return forms;
}
/**
 * Creates forms for Japanese word.
 *
 * @param {string}  word            The word to check.
 * @param {Object}  morphologyData  The morphology data.
 * @returns {Array} The array of created forms.
 */
export default function( word, morphologyData ) {
	// Check if the word is longer than 1 character
	if ( word.length <= 1 ) {
		return [ word ];
	}
	return createForms( word, morphologyData );
}
