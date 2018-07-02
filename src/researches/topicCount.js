/** @module analyses/getTopicCount */
const matchTextWithArray = require( "../stringProcessing/matchTextWithArray.js" );
const normalizeQuotes = require( "../stringProcessing/quotes.js" ).normalize;
const parseSynonyms = require( "../stringProcessing/parseSynonyms" );
const unique = require( "lodash/uniq" );
const isEmpty = require( "lodash/isEmpty" );
const getSentences = require( "../stringProcessing/getSentences" );
const arrayToRegex = require( "../stringProcessing/createRegexFromArray" );
const addMark = require( "../markers/addMarkSingleWord" );
const Mark = require( "../values/Mark.js" );

/**
 * Calculates the topic count, i.e., how many times the keyword or its synonyms were encountered in the text.
 *
 * @param {Object} paper The paper containing keyword, text and potentially synonyms.
 * @returns {number} The keyword count.
 */
module.exports = function( paper ) {
	const keyword = paper.getKeyword();
	const synonyms = parseSynonyms( paper.getSynonyms() );
	const text = normalizeQuotes( paper.getText() );
	const sentences = getSentences( text );

	let topicWords = [].concat( keyword, synonyms ).filter( Boolean );
	topicWords.sort( ( a, b ) => b.length - a.length );

	if ( isEmpty( topicWords ) ) {
		return {
			count: 0,
			matches: [],
			markings: [],
			matchesIndices: [],
		};
	}

	let topicFound = [];
	let topicFoundInSentence = [];
	let markings = [];
	let indexOfSentence = 0;
	let indexRunningThroughSentence = 0;
	let matchesIndices = [];

	sentences.forEach( function( sentence ) {
		topicFoundInSentence = matchTextWithArray( sentence, topicWords );
		if ( topicFoundInSentence.length > 0 ) {
			topicFoundInSentence.forEach( function( occurrence ) {
				const indexOfOccurrenceInSentence = sentence.indexOf( occurrence, indexRunningThroughSentence );
				matchesIndices.push(
					{
						index: indexOfOccurrenceInSentence + indexOfSentence,
						match: occurrence,
					}
				);
				indexRunningThroughSentence += indexOfOccurrenceInSentence + occurrence.length;
			} );

			markings = markings.concat( new Mark( {
				original: sentence,
				marked: sentence.replace( arrayToRegex( topicFoundInSentence ),  function( x ) {
					return addMark( x );
				} ),
			} ) );
		}

		topicFound = topicFound.concat( topicFoundInSentence );
		indexOfSentence += sentence.length + 1;
	} );

	return {
		count: topicFound.length,
		matches: unique( topicFound ).sort( ( a, b ) => b.length - a.length ),
		markings: markings,
		matchesIndices: matchesIndices,
	};
};


