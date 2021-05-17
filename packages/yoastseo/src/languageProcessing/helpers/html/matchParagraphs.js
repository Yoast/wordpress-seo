import { map } from "lodash-es";
import { flatMap } from "lodash-es";
import { filter } from "lodash-es";

import { getBlocks } from "./html";

/**
 * Matches the paragraphs in <p>-tags and returns the text in them.
 *
 * @param {string} text The text to match paragraph in.
 *
 * @returns {array} An array containing all paragraphs texts.
 */
const getParagraphsInTags = function( text ) {
	const paragraphs = [];
	// Matches everything between the <p> and </p> tags.
	const regex = /<p(?:[^>]+)?>(.*?)<\/p>/ig;
	let match;

	while ( ( match = regex.exec( text ) ) !== null ) {
		paragraphs.push( match );
	}

	// Returns only the text from within the paragraph tags.
	return map( paragraphs, function( paragraph ) {
		return paragraph[ 1 ];
	} );
};

/**
 * Returns an array with all paragraphs from the text.
 *
 * @param {string} text The text to match paragraph in.
 *
 * @returns {Array} The array containing all paragraphs from the text.
 */
export default function( text ) {
	let paragraphs = getParagraphsInTags( text );

	if ( paragraphs.length > 0 ) {
		return paragraphs;
	}

	// If no <p> tags found, split on double linebreaks.
	let blocks = getBlocks( text );

	blocks = filter( blocks, function( block ) {
		// Match explicit paragraph tags, or if a block has no HTML tags.
		return 0 !== block.indexOf( "<h" );
	} );

	paragraphs = flatMap( blocks, function( block ) {
		return block.split( "\n\n" );
	} );

	if ( paragraphs.length > 0 ) {
		return paragraphs;
	}

	// If no paragraphs are found, return an array containing the entire text.
	return [ text ];
}
