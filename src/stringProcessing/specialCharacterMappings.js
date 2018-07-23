const unique = require( "lodash/uniq" );

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
	return acc( array, [ [ ] ] ).slice( 1 );
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
 * @returns {string} A regex-ready string that contains all possible upper and lower case alternatives of the original string
 */
module.exports = function( text ) {
	// Get indices of all occurrences of letters "İ", "I", "i" or "ı".
	const indicesDottedI = getIndicesOfCharacter( text, "İ" );
	const indicesDotlessI = getIndicesOfCharacter( text, "I" );
	const indicesDottedi = getIndicesOfCharacter( text, "i" );
	const indicesDotlessi = getIndicesOfCharacter( text, "ı" );

	// Generate all possible combinations of indices to replace at the following step.
	const combinationsOfIndicesDottedI = combinations( indicesDottedI );
	const combinationsOfIndicesDotlessI = combinations( indicesDotlessI );
	const combinationsOfIndicesDottedi = combinations( indicesDottedi );
	const combinationsOfIndicesDotlessi = combinations( indicesDotlessi );

	let results = [].concat( text );

	// Add İ to i substitutions.
	combinationsOfIndicesDottedI.forEach( function( combination ) {
		results.push( replaceCharactersByIndex( text, combination, "i" ) );
	} );

	// Add I to ı substitutions.
	combinationsOfIndicesDotlessI.forEach( function( combination ) {
		results.push( replaceCharactersByIndex( text, combination, "ı" ) );
	} );

	// Add i to İ substitutions.
	combinationsOfIndicesDottedi.forEach( function( combination ) {
		results.push( replaceCharactersByIndex( text, combination, "İ" ) );
	} );

	// Add ı to I substitutions.
	combinationsOfIndicesDotlessi.forEach( function( combination ) {
		results.push( replaceCharactersByIndex( text, combination, "I" ) );
	} );

	// Everything to upper case.
	const allDotteditoUpperCase = replaceCharactersByIndex( text, indicesDottedi, "İ" );
	results.push( replaceCharactersByIndex( allDotteditoUpperCase, indicesDotlessi, "I" ) );

	// Everything to lower case.
	const allDottedItoLowerCase = replaceCharactersByIndex( text, indicesDottedI, "i" );
	results.push( replaceCharactersByIndex( allDottedItoLowerCase, indicesDotlessI, "ı" ) );

	// Everything to standard Latin.
	const allDottedIToDotless = replaceCharactersByIndex( text, indicesDottedI, "I" );
	results.push( replaceCharactersByIndex( allDottedIToDotless, indicesDotlessi, "i" ) );

	return unique( results ).join( "|" );
};
