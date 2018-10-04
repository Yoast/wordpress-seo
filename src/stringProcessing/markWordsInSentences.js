import matchWords from "./matchTextWithArray";
import arrayToRegex from "./createRegexFromArray";
import addMark from "../markers/addMarkSingleWord";
import Mark from "../values/Mark";

/**
 * Adds marks to words in a sentence.
 *
 * @param {[string]}    wordsToMark The words to mark.
 * @param {[string]}    sentences   The sentences in which to mark these words.
 * @param {string}      locale      The locale.
 *
 * @returns {[string]} The sentences with marks.
 */
export function markWordsInSentences( wordsToMark, sentences, locale ) {
	let topicFoundInSentence = [];
	let markings = [];
	let indexOfSentence = 0;
	let indexRunningThroughSentence = 0;
	let matchesIndices = [];

	sentences.forEach( function( sentence ) {
		topicFoundInSentence = matchWords( sentence, wordsToMark, locale ).matches;

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
				marked: sentence.replace( arrayToRegex( topicFoundInSentence ), function( x ) {
					return addMark( x );
				} ),
			} ) );
		}
	} );

	return markings;
}
