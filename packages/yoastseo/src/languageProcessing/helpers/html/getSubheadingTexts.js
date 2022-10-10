import { isUndefined } from "lodash-es";

/**
 * Returns all texts per subheading.
 *
 * @param {string} text The text to analyze from.
 *
 * @returns {Array} an array with text blocks per subheading.
 */
export default function( text ) {
	/*
	 Matching this in a regex is pretty hard, since we need to find a way for matching the text after a heading, and before the end of the text.
	 The hard thing capturing this is with a capture, it captures the next subheading as well, so it skips the next part of the text,
	 since the subheading is already matched.
	 For now we use this method to be sure we capture the right blocks of text. We remove all | 's from text,
	 then replace all headings with a | and split on a |.
	 */
	text = text.replace( /\|/ig, "" );
	const subheadingBlocks = [ ...text.matchAll( new RegExp( "<h([1-6])(?:[^>]+)?>(.*?)<\\/h\\1>", "ig" ) ) ];

	const foundSubheadings = [];

	subheadingBlocks.forEach( ( block, i ) => {
		const subheading = block[ 0 ];
		const currentMatchIndex = block.index;
		const nextBlock = subheadingBlocks[ i + 1 ];
		// Find the first subheading in the text
		let nextMatchIndex;
		if ( isUndefined( nextBlock ) ) {
			nextMatchIndex = block.input.length;
		} else {
			nextMatchIndex = nextBlock.index;
		}
		const currentBlockText = block.input.slice( currentMatchIndex + subheading.length, nextMatchIndex );
		foundSubheadings.push( {
			subheading: subheading,
			text: currentBlockText,
			index: currentMatchIndex,
		} );
	} );
	return { foundSubheadings: foundSubheadings, text: text };
}


