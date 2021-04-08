import { forEach, includes } from "lodash-es";
// import { languageProcessing } from "yoastseo";
// const { matchRegularParticiples, directPrecedenceException, getWords, precedenceException } = languageProcessing;

import matchRegularParticiples from "../../../../helpers/passiveVoice/periphrastic/matchRegularParticiples";
import getWords from "../../../../helpers/word/getWords";
import irregularParticiples from "../../config/internal/passiveVoiceIrregulars";

/**
 * Creates participle objects for the participles found in a sentence part.
 *
 * @param {string} clauseText The sentence part to find participles in
 *
 * @returns {Array} The list with participle objects.
 */
export default function getParticiples( clauseText ) {
	const words = getWords( clauseText );
	const foundParticiples = [];

	forEach( words, function( word ) {
		const regex = [ /\w+ed($|[ \n\r\t.,'()"+\-;!?:/»«‹›<>])/ig ];
		if ( matchRegularParticiples( word, regex ).length !== 0 || includes( irregularParticiples, word ) ) {
			foundParticiples.push( word );
		}
	} );
	return foundParticiples;
}
