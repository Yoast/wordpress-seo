import { map } from "lodash-es";
import TinySegmenter from "tiny-segmenter";

/**
 * Split sentence into tokens.
 *
 * @param {Sentence} text The text to split.
 *
 * @returns {Token[]} The tokens.
 */
function splitIntoTokensCustom( text ) {
	// Return empty string if sentence is empty
	if ( text === "" ) {
		return [];
	}
	// Split sentences into words that are also tokens
	const words = new TinySegmenter().segment( text );
	return map( words );
}
export default splitIntoTokensCustom;
