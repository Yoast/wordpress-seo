const filter = require( "lodash/filter" );
const includes = require( "lodash/includes" );
const memoize = require( "lodash/memoize" );

/**
 * Gets indices of a specific character in the input text.
 *
 * @param {string} text The original text, for which the indices of specific characters have to be determined.
 * @param {string} characterToFind The character that needs to be found in the text.
 *
 * @returns {Array} indices The array of indices in the text at which the characterToFind occurs.
 */
function getIndicesOfCharacter( text, characterToFind ) {
	let indices = [];

	if ( text.indexOf( characterToFind ) > -1 ) {
		for( let i = 0; i < text.length; i++ ) {
			if ( text[ i ] === characterToFind ) {
				indices.push( i );
			}
		}
	}

	return indices;
}

/**
 * Compares two arrays of which the second array is the sub-array of the first array.
 * Returns the array of elements of the first array which are not in the second array.
 *
 * @param {Array} bigArray The array with all elements.
 * @param {Array} subarray The array with some elements from the bigArray.
 *
 * @returns {Array} difference An array of all elements of bigArray which are not in subarray.
 */
function arraysDifference( bigArray, subarray ) {
	return filter( bigArray, function( element ) {
		return ( ! includes( subarray, element ) );
	} );
}


/**
 * Generates all possible combinations of the elements of an array (treated as unique).
 * https://gist.github.com/jpillora/4435759
 *
 * @param {Array} array The array with elements that should be combined.
 *
 * @returns {Array} result An array of all possible combinations of elements of the original array.
 */
function combinations( array ) {
	/**
	 * A recursive function that iterates through all elements of an array to produce its combinations.
	 *
	 * @param {Array} xs The array to start accumulating with.
	 * @param {Array} array The array with elements that should be combined.
	 *
	 * @returns {Array} result An array of all possible combinations of elements of the original array.
	 */
	function acc( xs, array ) {
		const x = xs[ 0 ];

		if( typeof x === "undefined" ) {
			return array;
		}

		for( let i = 0, l = array.length; i < l; ++i ) {
			array.push( array[ i ].concat( x ) );
		}
		return acc( xs.slice( 1 ), array );
	}
	return acc( array, [ [ ] ] ).slice( 1 ).concat( [ [] ] );
}


/**
 * Replaces characters on specified indices in the input text.
 *
 * @param {string} text The original text, for which the characters have to be substituted.
 * @param {Array} indices The array of indices that have to be substituted.
 * @param {string} substitute The character that is used to substitute in the text.
 *
 * @returns {string} result The string of the original text with the characters on specified indices are substituted with the substitute character.
 */
function replaceCharactersByIndex( text, indices, substitute ) {
	let modifiedTextSplitByLetter = text.split( "" );

	indices.forEach( function( index ) {
		modifiedTextSplitByLetter.splice( index, 1, substitute );
	} );

	return modifiedTextSplitByLetter.join( "" );
}

/**
 * Generates upper and lower case for Turkish strings that contain characters İ or ı, which appear to not be processed correctly by regexes.
 *
 * @param {string} text The text to build possible upper and lower case alternatives.
 *
 * @returns {Array} An array of strings that contains all possible upper and lower case alternatives of the original string
 */
function replaceTurkishIs( text ) {
	// Get indices of all occurrences of İ, I, i, or ı.
	let indicesOfAllIs = getIndicesOfCharacter( text, "İ" ).concat(
		getIndicesOfCharacter( text, "I" ),
		getIndicesOfCharacter( text, "i" ),
		getIndicesOfCharacter( text, "ı" )
	);
	indicesOfAllIs.sort();

	// If there are no Is return the text
	if ( indicesOfAllIs.length === 0 ) {
		return [ text ];
	}

	let results = [];

	// First round of creating combinations: assign which indices will be replaced by İ
	const combinationsDottedI = combinations( indicesOfAllIs );

	combinationsDottedI.forEach( function( oneCombinationDottedI ) {
		// If the combination is full array, just add it to results immediately without going through the rest of iterations.
		if ( oneCombinationDottedI === indicesOfAllIs ) {
			results.push( [ oneCombinationDottedI, [], [], [] ] );
		} else {
			const indicesNotDottedI = arraysDifference( indicesOfAllIs, oneCombinationDottedI );

			// Second round of creating combinations: assign which indices will be replaced by I
			const combinationsDotlessI = combinations( indicesNotDottedI );
			combinationsDotlessI.forEach( function( oneCombinationDotlessI ) {
				// If the combination is full array, just add it to results immediately without going through the rest of iterations.
				if ( oneCombinationDotlessI === indicesNotDottedI ) {
					results.push( [ oneCombinationDottedI, oneCombinationDotlessI, [], [] ] );
				} else {
					const indicesSmalli = arraysDifference( indicesNotDottedI, oneCombinationDotlessI );

					// Third round of creating combinations: assign which indices will be replaced by i
					const combinationsDottedi = combinations( indicesSmalli );

					combinationsDottedi.forEach( function( oneCombinationDottedi ) {
						// If the combination is full array, just add it to results immediately without going through the rest of iterations.
						if ( oneCombinationDottedi === indicesSmalli ) {
							results.push( [ oneCombinationDottedI, oneCombinationDotlessI, oneCombinationDottedi, [] ] );
						} else {
							const oneCombinationDotlessi = arraysDifference( indicesSmalli, oneCombinationDottedi );

							results.push( [ oneCombinationDottedI, oneCombinationDotlessI, oneCombinationDottedi, oneCombinationDotlessi ] );
						}
					} );
				}
			} );
		}
	} );

	let textAlternations = [];

	results.forEach( function( result ) {
		const toDottedI = replaceCharactersByIndex( text, result[ 0 ], "İ" );
		const toDotlessI = replaceCharactersByIndex( toDottedI, result[ 1 ], "I" );
		const toDottedi = replaceCharactersByIndex( toDotlessI, result[ 2 ], "i" );
		const toDotlessi = replaceCharactersByIndex( toDottedi, result[ 3 ], "ı" );
		textAlternations.push( toDotlessi );
	} );

	return textAlternations;
}

const replaceTurkishIsMemoized = memoize( replaceTurkishIs );

export {
	getIndicesOfCharacter,
	arraysDifference,
	combinations,
	replaceTurkishIs,
	replaceTurkishIsMemoized,
};
