/** @module analyses/getTopicCount */
import matchTextWithArray from "../stringProcessing/matchTextWithArray.js";

import { normalize as normalizeQuotes } from "../stringProcessing/quotes.js";
import parseSynonyms from "../stringProcessing/parseSynonyms";
import { uniq as unique } from "lodash-es";
import { isEmpty } from "lodash-es";
import getSentences from "../stringProcessing/getSentences";
import arrayToRegex from "../stringProcessing/createRegexFromArray";
import addMark from "../markers/addMarkSingleWord";
import Mark from "../values/Mark.js";

/**
 * Calculates the topic count, i.e., how many times the keyword or its synonyms were encountered in the text.
 *
 * @param {Object}  paper                   The paper containing keyword, text and potentially synonyms.
 * @param {boolean} [onlyKeyword=false]     Whether to only use the keyword for the count.
 *
 * @returns {number} The keyword count.
 */
export default function( paper, onlyKeyword = false ) {
	const keyword = paper.getKeyword();
	const synonyms = parseSynonyms( paper.getSynonyms() );
	const text = normalizeQuotes( paper.getText() );
	const sentences = getSentences( text );
	let topicWords = [];

	if ( onlyKeyword === true ) {
		topicWords = topicWords.concat( keyword );
	} else {
		topicWords = topicWords.concat( keyword, synonyms ).filter( Boolean );
		topicWords.sort( ( a, b ) => b.length - a.length );
	}

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
	const matchesIndices = [];

	sentences.forEach( function( sentence ) {
		topicFoundInSentence = matchTextWithArray( sentence, topicWords, paper.getLocale() ).matches;
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
}


