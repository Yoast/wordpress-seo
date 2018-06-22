const parseSynonyms = require( "../stringProcessing/parseSynonyms" );
const getIndicesByWordListSorted = require( "../stringProcessing/indices" ).getIndicesByWordListSorted;
const sortBy = require( "lodash/sortBy" );
const normalizeQuotes = require( "../stringProcessing/quotes.js" ).normalize;

/**
 * Gets the distance (in terms of characters) between two keywords, between the beginning
 * of the text and the first keyword, or the last keyword and the end of the text.
 *
 * @param {number}  keywordIndex     The index of the keyword.
 * @param {Array}   keywordIndices   All keyword indices.
 * @param {number}  textLength       The length of the text in characters.
 *
 * @returns {Array} The distances for a given keyword in characters.
 */
const getKeywordDistances = function( keywordIndex, keywordIndices, textLength ) {
	const currentIndexWithinArray = keywordIndices.indexOf( keywordIndex );
	let indexOfPreviousKeyword;

	let distances = [];

	/*
	 * If there's only one keyword, return the distance from the beginning
	 * of the text to the keyword and from the keyword to the end of the text.
	 */
	if ( currentIndexWithinArray === 0 && keywordIndices.length === 1 ) {
		distances.push( keywordIndex.index );
		distances.push( textLength - keywordIndex.index );

		return distances;
	}

	/*
	 * For the first instance of the keyword calculate the distance between
	 * the beginning of the text and that keyword.
	 */
	if ( currentIndexWithinArray === 0 ) {
		distances.push( keywordIndex.index );

		return distances;
	}

	/*
	 * For the last instance of the keyword, calculate the distance between that keyword
	 * and the previous keyword and also the distance between that keyword and the end
	 * of the text.
	 */
	if ( currentIndexWithinArray === keywordIndices.length - 1 ) {
		indexOfPreviousKeyword = keywordIndices[ currentIndexWithinArray - 1 ].index;
		distances.push( keywordIndex.index - indexOfPreviousKeyword );
		distances.push( textLength - keywordIndex.index );

		return distances;
	}

	/*
	 * For all instances in between first and last, calculate the distance between
	 * that keyword and the preceding keyword.
	 */
	indexOfPreviousKeyword = keywordIndices[ currentIndexWithinArray - 1 ].index;
	distances.push( keywordIndex.index - indexOfPreviousKeyword );

	return distances;
};

/**
 * Gets the largest keyword distance (in characters) from the array of all keyword distances.
 *
 * @param {Array} keywordDistances All keyword distances in characters.
 *
 * @returns {number} The largest keyword distance in characters.
 */
const getLargestDistanceInCharacters = function( keywordDistances ) {
	keywordDistances = sortBy( keywordDistances );
	keywordDistances = keywordDistances.reverse();

	return keywordDistances[ 0 ];
};

/**
 * Calculates the largest percentage of the text without a keyword.
 *
 * @param {Paper} paper The paper to check the keyword distance for.
 *
 * @returns {number} Returns the largest percentage of the text between two keyword occurrences
 *                   or a keyword occurrence and the start/end of the text.
 */
module.exports = function( paper ) {
	let text = paper.getText();
	text = text.toLowerCase();
	text = normalizeQuotes( text );

	let keyword = paper.getKeyword();
	keyword = keyword.toLowerCase();
	keyword = normalizeQuotes( keyword );

	let topicArray = [].concat( keyword );

	// todo: change it to paper.hasSynonyms()===true as soon as the synonym interface is ready.
	if ( keyword.indexOf( "," ) > 0 ) {
		topicArray = parseSynonyms( keyword );
	}

	const keywordIndices = getIndicesByWordListSorted( topicArray, text );

	let keywordDistances = [];

	for ( let keywordIndex of keywordIndices ) {
		let currentDistances = getKeywordDistances( keywordIndex, keywordIndices, text.length );
		keywordDistances = keywordDistances.concat( currentDistances );
	}

	const largestKeywordDistanceInCharacters = getLargestDistanceInCharacters( keywordDistances );

	return ( largestKeywordDistanceInCharacters / text.length ) * 100;
};
