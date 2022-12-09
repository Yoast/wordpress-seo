import { escapeRegExp } from "lodash-es";
import addMark from "../../../markers/addMarkSingleWord";
import Mark from "../../../values/Mark";
import getAnchorsFromText from "../link/getAnchorsFromText";
import matchWords from "../match/matchTextWithArray";
import arrayToRegex from "../regex/createRegexFromArray";

// Regex to deconstruct an anchor into open tag, content and close tag.
const anchorDeconstructionRegex = /(<a[\s]+[^>]+>)((?:.|[\n\r\u2028\u2029])*?)(<\/a>)/;


/**
 * Deconstructs an anchor to the opening tag and the content. The content is the anchor text.
 * We don't return the closing tag since the value would always be the same, i.e. </a>.
 *
 * @param {string} anchor An anchor of the shape <a ...>...</a>.
 *
 * @returns {object} An object containing the opening tag and the content.
 */
export const deConstructAnchor = function( anchor ) {
	// The const array mirrors the anchorDeconstructionRegex, using a comma to access the first element without a name.
	const [ , openTag, content ] = anchor.match( anchorDeconstructionRegex );
	return {
		openTag: openTag,
		content: content,
	};
};

/**
 * Reconstructs an anchor from an openTag, the content, and the closing tag.
 *
 * @param {string} openTag The opening tag of the anchor. Must be of the shape <a ...>.
 * @param {string} content The text of the anchor.
 *
 * @returns {string} An anchor.
 */
export const reConstructAnchor = function( openTag, content ) {
	return `${openTag}${content}</a>`;
};


/**
 * Gets the anchors and marks the anchors' text if the words are found in it.
 *
 * @param {string} sentence The sentence to retrieve the anchors from.
 * @param {RegExp} wordsRegex The regex of the words.
 *
 * @returns {Object} The anchors and the marked anchors.
 */
const getMarkedAnchors = function( sentence, wordsRegex ) {
	// Retrieve the anchors.
	const anchors = getAnchorsFromText( sentence );
	// For every anchor, apply the markings only to the anchor tag.
	const markedAnchors = anchors.map( anchor => {
		// Retrieve the open tag and the content/anchor text.
		const { openTag, content } = deConstructAnchor( anchor );

		// Apply the marking to the anchor text if there is a match.
		const markedAnchorText = content.replace( wordsRegex, ( x ) => addMark( x ) );

		// Create a new anchor tag with a (marked) anchor text.
		return reConstructAnchor( openTag, markedAnchorText );
	} );

	return { anchors, markedAnchors };
};

/**
 * Adds marks to a sentence and merges marks if those are only separated by a space
 * (e.g., if highlighting words "ballet" and "shoes" in a sentence "I have a lot of ballet shoes and other paraphernalia."
 * the marks will be put around "ballet shoes" together, not "`ballet` `shoes`".)
 *
 * @param {string}    sentence               The sentence to mark words in.
 * @param {[string]}  wordsFoundInSentence   The words to mark in the sentence.
 * @param {function}  matchWordCustomHelper  The language-specific helper function to match word in text.
 *
 * @returns {string} The sentence with marks.
 */
export const collectMarkingsInSentence = function( sentence, wordsFoundInSentence, matchWordCustomHelper ) {
	wordsFoundInSentence = wordsFoundInSentence.map( word => escapeRegExp( word ) );
	// If a language has a custom helper to match words, we disable the word boundary when creating the regex.
	const wordsRegex = matchWordCustomHelper ? arrayToRegex( wordsFoundInSentence, true ) : arrayToRegex( wordsFoundInSentence );

	// Retrieve the anchors and mark the anchors' text if the words are found in the anchors' text.
	const { anchors, markedAnchors } = getMarkedAnchors( sentence, wordsRegex );

	let markup = sentence.replace( wordsRegex, function( x ) {
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

	/*
	 * If two marks are separated by only a space, remove the closing tag of the first mark and the opening tag of the
	 * second mark so that the two marks can be combined into one.
	 */
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
	let wordsFoundInSentence = [];
	let markings = [];

	sentences.forEach( function( sentence ) {
		wordsFoundInSentence = matchWords( sentence, wordsToMark, locale, matchWordCustomHelper ).matches;

		if ( wordsFoundInSentence.length > 0 ) {
			markings = markings.concat( new Mark( {
				original: sentence,
				marked: collectMarkingsInSentence( sentence, wordsFoundInSentence, matchWordCustomHelper ),
			} ) );
		}
	} );

	return markings;
}
