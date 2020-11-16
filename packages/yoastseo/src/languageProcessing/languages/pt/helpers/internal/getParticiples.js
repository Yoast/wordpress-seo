import { forEach, includes } from "lodash-es";
import getWords from "../../../../helpers/word/getWords";
import participles from "../../config/internal/passiveVoiceParticiples";
import PortugueseParticiple from "../../values/PortugueseParticiple";

/**
 * Creates participle objects for the participles found in a sentence part.
 *
 * @param {string} sentencePartText The sentence part to find participles in.
 * @param {Array} auxiliaries The list of auxiliaries from the sentence part.
 *
 * @returns {Array} The list with participle objects.
 */
export default function getParticiples( sentencePartText, auxiliaries ) {
	const words = getWords( sentencePartText );
	const foundParticiples = [];

	forEach( words, function( word ) {
		if ( includes( participles, word ) ) {
			foundParticiples.push( new PortugueseParticiple( word, sentencePartText,
				{ auxiliaries: auxiliaries, type: "irregular", language: "pt" } ) );
		}
	} );
	return foundParticiples;
}
