// Lodash imports.
import { filter, flatMap, isEmpty, negate } from "lodash-es";

// Internal dependencies.
import { getBlocks } from "../html/html.js";
import { imageRegex } from "../image/imageInText";
import excludeTableOfContentsTag from "../sanitize/excludeTableOfContentsTag";
import excludeEstimatedReadingTime from "../sanitize/excludeEstimatedReadingTime";
import { unifyNonBreakingSpace } from "../sanitize/unifyWhitespace";
import defaultSentenceTokenizer from "./memoizedSentenceTokenizer";

// Character classes.
const newLines = "\n\r|\n|\r";

// Regular expressions.
const newLineRegex = new RegExp( newLines );
const paragraphTagsRegex = new RegExp( "^(<p>|</p>)$" );

/**
 * Returns sentences in a string.
 *
 * @param {String}      text                The string to count sentences in.
 * @param {function}    memoizedTokenizer   The memoized sentence tokenizer.
 *
 * @returns {Array} Sentences found in the text.
 */
export default function( text, memoizedTokenizer ) {
	if ( ! memoizedTokenizer ) {
		memoizedTokenizer = defaultSentenceTokenizer;
	}
	// We don't remove the other HTML tags here since removing them might lead to incorrect results when running the sentence tokenizer.
	// Remove Table of Contents.
	text = excludeTableOfContentsTag( text );
	// Remove Estimated reading time.
	text = excludeEstimatedReadingTime( text );
	// Unify only non-breaking spaces and not the other whitespaces since a whitespace could signify a sentence break or a new line.
	text = unifyNonBreakingSpace( text );
	// Remove images from text before tokenizing it into sentences.
	// This step is done here so that applying highlight in captions is possible for all assessments that use this helper.
	text = text.replace( imageRegex, "" );

	let blocks = getBlocks( text );

	// Split each block on newlines.
	blocks = flatMap( blocks, function( block ) {
		return block.split( newLineRegex );
	} );

	/*
	 * Filter blocks that contain only paragraph tags. This step is necessary
	 * since switching between editors might add extra paragraph tags with a new line tag in the end
	 * that are incorrectly converted into separate blocks.
	 */
	blocks = blocks.filter( block => ! paragraphTagsRegex.test( block ) );

	/*
	 * We use the `map` method followed by `flat` instead of `flatMap` because `flatMap` would override the second
	 * argument of the memoizedTokenizer with the index of the iteratee.
	 */
	let sentences = blocks.map( block => memoizedTokenizer( block ) );

	return filter( sentences.flat(), negate( isEmpty ) );
}
