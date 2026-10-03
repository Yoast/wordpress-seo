import { map } from "lodash";
import TinySegmenter from "tiny-segmenter";

/**
 * Split sentence into tokens.
 *
 * @param {string} sentenceText The sentence text to split.
 *
 * @returns {Token[]} The tokens.
 */
function splitIntoTokensCustom( sentenceText ) {
	// Return empty string if sentence is empty.
	if ( sentenceText === "" ) {
		return [];
	}
	// Split sentences into words that are also tokens.
	const words = new TinySegmenter().segment( sentenceText );
	return map( words );
}
export default splitIntoTokensCustom;
