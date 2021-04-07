import { forEach, includes, intersection, isEmpty } from "lodash-es";
import getWords from "../../../../helpers/word/getWords";
import matchRegularParticiples from "../../../../helpers/passiveVoice/periphrastic/matchRegularParticiples";
import irregularParticiples from "../../config/internal/passiveVoiceIrregulars";
import nonVerbsEndingEd from "../../config/internal/passiveVoiceNonVerbEndingEd.js";
import directPrecedenceException from "../../../../helpers/passiveVoice/directPrecedenceException";
import precedenceException from "../../../../helpers/passiveVoice/precedenceException";
import {
	cannotDirectlyPrecedePassiveParticiple,
	cannotBeBetweenPassiveAuxiliaryAndParticiple,
} from "../../config/functionWords.js";

/**
 * Creates participle objects for the participles found in a sentence part.
 *
 * @param {string} clauseText The sentence part to find participles in
 *
 * @returns {Array} The list with participle objects.
 */
function getParticiples( clauseText ) {
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

/**
 * Checks whether the participle is 'rid' in combination with 'get', 'gets', 'getting', 'got' or 'gotten'.
 * If this is true, the participle is not passive.
 *
 * @param {string} participle   The participle
 * @param {Array} auxiliaries   The array of auxiliaries
 *
 * @returns {boolean} Returns true if 'rid' is found in combination with a form of 'get'
 * otherwise returns false.
 */
function hasRidException( participle, auxiliaries ) {
	if ( participle === "rid" ) {
		const irregularExclusionArray = [ "get", "gets", "getting", "got", "gotten" ];
		return ! isEmpty( intersection( irregularExclusionArray, auxiliaries ) );
	}
	return false;
}

/**
 * Checks if any exceptions are applicable to this participle that would result in the sentence part not being passive.
 * If no exceptions are found, the sentence part is passive.
 *
 * @param {string} clauseText   The text of the clause
 * @param {Array} auxiliaries   The array of the auxiliaries
 * @param {string} participle   The participle
 *
 * @returns {boolean} Returns true if no exception is found.
 */
function checkParticiples( clauseText, auxiliaries, participle,  ) {
	return ! includes( nonVerbsEndingEd, participle ) &&
		! hasRidException( participle, auxiliaries ) &&
		! directPrecedenceException( clauseText, participle, cannotDirectlyPrecedePassiveParticiple ) &&
		! precedenceException( clauseText, participle, cannotBeBetweenPassiveAuxiliaryAndParticiple );
}

export { getParticiples, checkParticiples };
