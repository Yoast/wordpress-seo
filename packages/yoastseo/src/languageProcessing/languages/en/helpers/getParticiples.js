import { forEach, includes } from "lodash-es";
import getWords from "../../../helpers/word/getWords";
import matchRegularParticiples from "../../../helpers/passiveVoice/periphrastic/matchRegularParticiples";
import irregularParticiples from "../config/internal/passiveVoiceIrregulars";
import EnglishParticiple from "../values/EnglishParticiple";

/**
 * Creates participle objects for the participles found in a sentence part.
 *
 * @param {string} sentencePartText The sentence part to find participles in.
 * @param {Array} auxiliaries The list of auxiliaries from the sentence part.
 * @returns {Array} The list with participle objects.
 */
export default function getParticiples( sentencePartText, auxiliaries ) {
	const words = getWords( sentencePartText );
	const foundParticiples = [];

	forEach( words, function( word ) {
		let type = "";
		if ( matchRegularParticiples( word, [ /\w+ed($|[ \n\r\t.,'()"+\-;!?:/»«‹›<>])/ig ] ).length !== 0 ) {
			type = "regular";
		}
		if ( includes( irregularParticiples, word ) ) {
			type = "irregular";
		}
		if ( type !== "" ) {
			foundParticiples.push( new EnglishParticiple( word, sentencePartText,
				{ auxiliaries: auxiliaries, type: type, language: "en" } ) );
		}
	} );
	return foundParticiples;
}
