import { includes } from "lodash";
import { languageProcessing } from "yoastseo";
const { getWords, matchRegularParticiples } = languageProcessing;

import irregularParticiples from "../../config/internal/passiveVoiceIrregulars";

/**
 * Creates an array of participle for the participles found in a clause.
 *
 * @param {string} clauseText The clause text to find participles in.
 *
 * @returns {Array} The list with participle.
 */
export default function getParticiples( clauseText ) {
	const words = getWords( clauseText );
	const regexes = [
		/^(ge|be|ont|ver|her|er)\S+([dt])($|[ \n\r\t.,'()"+\-;!?:/»«‹›<>])/ig,
		/^(aan|af|bij|binnen|los|mee|na|neer|om|onder|samen|terug|tegen|toe|uit|vast)(ge)\S+([dtn])($|[ \n\r\t.,'()"+\-;!?:/»«‹›<>])/ig,
	];

	return words.filter( word => matchRegularParticiples( word, regexes ).length !== 0 || includes( irregularParticiples, word ) );
}
