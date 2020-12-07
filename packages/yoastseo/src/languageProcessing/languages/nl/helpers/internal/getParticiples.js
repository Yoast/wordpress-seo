import { forEach, includes } from "lodash-es";
import getWords from "../../../../helpers/word/getWords";
import matchRegularParticiples from "../../../../helpers/passiveVoice/periphrastic/matchRegularParticiples";
import irregularParticiples from "../../config/internal/passiveVoiceIrregulars";
import DutchParticiple from "../../values/DutchParticiple";

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
		const regexes = [
			/^(ge|be|ont|ver|her|er)\S+([dt])($|[ \n\r\t.,'()"+\-;!?:/»«‹›<>])/ig,
			/^(aan|af|bij|binnen|los|mee|na|neer|om|onder|samen|terug|tegen|toe|uit|vast)(ge)\S+([dtn])($|[ \n\r\t.,'()"+\-;!?:/»«‹›<>])/ig,
		];
		if ( matchRegularParticiples( word, regexes ).length !== 0 ) {
			type = "regular";
		}
		if ( includes( irregularParticiples, word ) ) {
			type = "irregular";
		}
		if ( type !== "" ) {
			foundParticiples.push( new DutchParticiple( word, sentencePartText,
				{ auxiliaries: auxiliaries, type: type, language: "nl" } ) );
		}
	} );
	return foundParticiples;
}
