import { forEach, includes } from "lodash-es";
import { languageProcessing } from "yoastseo";
const { matchRegularParticiples, getWords } = languageProcessing;

/**
 * Creates participle array for the participles found in a clause.
 *
 * @param {string} clauseText       The sentence part to find participles in.
 *
 * @returns {Array} The list with participles.
 */
export default function getParticiples( clauseText) {
	const words = getWords( clauseText );
	const foundParticiples = [];

	forEach( words, function( word ) {
		const regex = [ /\w+ed($|[ \n\r\t.,'()"+\-;!?:/»«‹›<>])/ig ];
		if ( matchRegularParticiples( word, regex ).length !== 0 || includes(
			irregularParticiples, word ) ) {
			foundParticiples.push( word );
		}
	} );
	return foundParticiples;
}
