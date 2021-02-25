import { forEach } from "lodash-es";
import getWords from "../../../../helpers/word/getWords.js";
import CzechParticiple from "../../values/CzechParticiple";
import getPassiveEndingsCzech from "../../config/internal/passiveVoiceEndings";


/**
 * Creates participle objects for the participles found in a sentence part.
 *
 * @param {string} sentencePartText The sentence part to find participles in.
 * @param {Array} auxiliaries The list of auxiliaries from the sentence part.
 * @returns {Array} The list with participle objects.
 */
export default function( sentencePartText, auxiliaries ) {
	const words = getWords( sentencePartText );

	const foundParticiples = [];

	forEach( words, function( word ) {
		forEach( getPassiveEndingsCzech, function( ending ) {
			if ( word.endsWith( ending ) ) {
				foundParticiples.push( new CzechParticiple( word, sentencePartText,
					{ auxiliaries: auxiliaries, language: "cz" } ) );
			}
		} );
	} );
	return foundParticiples;
}
