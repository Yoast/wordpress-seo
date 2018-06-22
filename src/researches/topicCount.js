/** @module analyses/getTopicCount */
const matchTextWithArray = require( "../stringProcessing/matchTextWithArray.js" );
const normalizeQuotes = require( "../stringProcessing/quotes.js" ).normalize;
const getSynonyms = require( "./getSynonyms.js" );
const unique = require( "lodash/uniq" );

/**
 * Calculates the topic count, i.e., how many times the keyword or its synonyms were encountered in the text.
 *
 * @param {Object} paper The paper containing keyword, text and potentially synonyms.
 * @returns {number} The keyword count.
 */
module.exports = function( paper ) {
	const getSynonymsResult = getSynonyms( paper );
	let topicWords = [].concat( getSynonymsResult.keyword, getSynonymsResult.synonyms );
	topicWords.sort( ( a, b ) => b.length - a.length );
	const text = normalizeQuotes( paper.getText() );

	const topicFound = matchTextWithArray( text, topicWords );

	return {
		count: topicFound.length,
		matches: unique( topicFound ).sort( ( a, b ) => b.length - a.length ),
	};
};


