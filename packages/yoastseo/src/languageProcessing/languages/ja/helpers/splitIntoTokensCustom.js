import { map } from "lodash-es";
import TinySegmenter from "tiny-segmenter";

/**
 * Split sentence into tokens.
 *
 * @param {Sentence} sentence The sentence to split.
 *
 * @returns {Token[]} The tokens.
 */
function splitIntoTokensCustom( sentence ) {
	// Retrieve sentence from sentence class
	const sentenceText = sentence.text;
	// Return empty string if sentence is empty
	if ( sentenceText === "" ) {
		return [];
	}
	// Split sentences into words that are also tokens
	const words = new TinySegmenter().segment( sentenceText );
	return map( words );
}
export default splitIntoTokensCustom;
