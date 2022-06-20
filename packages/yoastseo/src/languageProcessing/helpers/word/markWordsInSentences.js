import matchWords from "../match/matchTextWithArray";
import arrayToRegex from "../regex/createRegexFromArray";
import addMark from "../../../markers/addMarkSingleWord";
import Mark from "../../../values/Mark";

/**
 * Adds marks to a sentence and merges marks if those are only separated by a space
 * (e.g., if highlighting words "ballet" and "shoes" in a sentence "I have a lot of ballet shoes and other paraphernalia."
 * the marks will be put around "ballet shoes" together, not "`ballet` `shoes`".)
 *
 * @param {string}    sentence               The sentence to mark words in.
 * @param {[string]}  topicFoundInSentence   The words to mark in the sentence.
 * @param {function}  matchWordCustomHelper  The language-specific helper function to match word in text.
 *
 * @returns {string} The sentence with marks.
 */
export const collectMarkingsInSentence = function( sentence, topicFoundInSentence, matchWordCustomHelper ) {
	// If a language has a custom helper to match words, we disable the word boundary when creating the regex.
	const topicRegex = matchWordCustomHelper ? arrayToRegex( topicFoundInSentence, true ) : arrayToRegex( topicFoundInSentence );
	const markup = sentence.replace( topicRegex, function( x ) {
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
 * @param {function}    matchWordCustomHelper   The language-specific helper function to match word in text.
 *
 * @returns {[string]} The sentences with marks.
 */
export function markWordsInSentences( wordsToMark, sentences, locale, matchWordCustomHelper ) {
	let topicFoundInSentence = [];
	let markings = [];

	sentences.forEach( function( sentence ) {
		topicFoundInSentence = matchWords( sentence, wordsToMark, locale, matchWordCustomHelper ).matches;

		if ( topicFoundInSentence.length > 0 ) {
			markings = markings.concat( new Mark( {
				original: sentence,
				marked: collectMarkingsInSentence( sentence, topicFoundInSentence, matchWordCustomHelper ),
			} ) );
		}
	} );

	return markings;
}
