import matchWords from "./matchTextWithArray";
import arrayToRegex from "./createRegexFromArray";
import addMark from "../../../markers/addMarkSingleWord";
import Mark from "../../../values/Mark";

/**
 * Adds marks to a sentence and merges marks if those are only separated by a space
 * (e.g., if highlighting words "ballet" and "shoes" in a sentence "I have a lot of ballet shoes and other paraphernalia."
 * the marks will be put around "ballet shoes" together, not "`ballet` `shoes`".)
 *
 * @param {string}    sentence               The sentence to mark words in.
 * @param {[string]}  topicFoundInSentence   The words to mark in the sentence.
 *
 * @returns {string} The sentence with marks.
 */
const collectMarkingsInSentence = function( sentence, topicFoundInSentence ) {
	const markup = sentence.replace( arrayToRegex( topicFoundInSentence ), function( x ) {
		return addMark( x );
	} );

	return ( markup.replace( new RegExp( "</yoastmark> <yoastmark class='yoast-text-mark'>", "ig" ), " " ) );
};

/**
 * Adds marks to an array of sentences.
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

	sentences.forEach( function( sentence ) {
		topicFoundInSentence = matchWords( sentence, wordsToMark, locale ).matches;

		if ( topicFoundInSentence.length > 0 ) {
			markings = markings.concat( new Mark( {
				original: sentence,
				marked: collectMarkingsInSentence( sentence, topicFoundInSentence ),
			} ) );
		}
	} );

	return markings;
}
