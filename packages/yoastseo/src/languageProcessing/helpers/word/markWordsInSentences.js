import getAnchorsFromText from "../link/getAnchorsFromText";
import matchWords from "../match/matchTextWithArray";
import arrayToRegex from "../regex/createRegexFromArray";
import addMark from "../../../markers/addMarkSingleWord";
import Mark from "../../../values/Mark";
import { escapeRegExp } from "lodash-es";
import { stripFullTags } from "../sanitize/stripHTMLTags";

/**
 * Gets the anchors and mark the anchors' text if the topic is found in the anchors' text.
 *
 * @param {string} sentence The sentence to retrieve the anchors from.
 * @param {RegExp} topicRegex The regex of the topic.
 *
 * @returns {Object} The anchors and the marked anchors.
 */
const getMarkedAnchors = function( sentence, topicRegex ) {
	// Retrieve the anchors.
	const anchors = getAnchorsFromText( sentence );
	// For every anchor, apply the markings only to the anchor tag. Replace the unmarked anchor in the sentence with the marked anchor.
	const markedAnchors = anchors.map( anchor => {
		// Get the anchor text.
		const anchorText = stripFullTags( anchor );
		// Apply the marking to the anchor text.
		const markedAnchorText = anchorText.replace( topicRegex, ( x ) => addMark( x ) );
		// Replace the original anchor text with the marked anchor text.
		return anchor.replace( anchorText, markedAnchorText );
	} );
	return { anchors, markedAnchors };
};

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
	topicFoundInSentence = topicFoundInSentence.map( word => escapeRegExp( word ) );
	// If a language has a custom helper to match words, we disable the word boundary when creating the regex.
	const topicRegex = matchWordCustomHelper ? arrayToRegex( topicFoundInSentence, true ) : arrayToRegex( topicFoundInSentence );

	// Retrieve the anchors and mark the anchors' text if the topic is found in the anchors' text.
	const { anchors, markedAnchors } = getMarkedAnchors( sentence, topicRegex );

	let markup = sentence.replace( topicRegex, function( x ) {
		return addMark( x );
	} );

	/**
	 * In 'markup', we apply the markings also inside the anchor's attribute if there is a match, on top of
	 * marking the anchor's text.
	 * The step below is to replace the incorrectly marked anchors with the marked anchors that we want:
	 * where the markings are only applied in the anchor's text.
	 */
	if ( anchors.length > 0 ) {
		const markupAnchors = getAnchorsFromText( markup );
		for ( let i = 0; i < markupAnchors.length; i++ ) {
			markup = markup.replace( markupAnchors[ i ], markedAnchors[ i ] );
		}
	}

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
