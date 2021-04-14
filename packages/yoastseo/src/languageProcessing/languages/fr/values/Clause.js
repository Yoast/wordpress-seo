import { includes, intersection, isEmpty } from "lodash-es";
import { languageProcessing, values } from "yoastseo";
const { Clause } = values;
import getParticiples from "../helpers/internal/getParticiples.js";
import { cannotBeBetweenPassiveAuxiliaryAndParticiple, cannotDirectlyPrecedePassiveParticiple } from "../config/functionWords";
const { precedenceException, directPrecedenceException } = languageProcessing;
import {
	adjectivesVerbs as exceptionsParticiplesAdjectivesVerbs,
	nounsStartingWithVowel as exceptionsParticiplesNounsVowel,
	nounsStartingWithConsonant as exceptionsParticiplesNounsConsonant,
	others as exceptionsParticiplesOthers,
} from "../config/internal/exceptionsParticiplesActive";

/**
 * Creates a Clause object for the English language.
 */
class FrenchClause extends Clause {
	/**
	 * Constructor.
	 *
	 * @param {string} clauseText   The text of the clause.
	 * @param {Array} auxiliaries   The auxiliaries.
	 *
	 * @constructor
	 */
	constructor( clauseText, auxiliaries ) {
		super( clauseText, auxiliaries );
		this._participles = getParticiples( this.getClauseText() );
		this.checkParticiples();
	}

	/**
	 * Checks if any exceptions are applicable to this participle that would result in the clause not being passive.
	 * If no exceptions are found, the clause is passive.
	 *
	 * @returns {boolean} Returns true if no exception is found.
	 */
	checkParticiples() {
		const clause = this.getClauseText();

		const passiveParticiples = this.getParticiples().filter( participle => ! includes( nonVerbsEndingEd, participle ) &&
			! this.hasRidException( participle ) &&
			! directPrecedenceException( clause, participle, cannotDirectlyPrecedePassiveParticiple ) &&
			! precedenceException( clause, participle, cannotBeBetweenPassiveAuxiliaryAndParticiple ) );

		this.setPassive( passiveParticiples.length > 0 );
	}

	/**
	 * Checks whether the participle is 'rid' in combination with 'get', 'gets', 'getting', 'got' or 'gotten'.
	 * If this is true, the participle is not passive.
	 *
	 * @param {string} participle   The participle
	 *
	 * @returns {boolean} Returns true if 'rid' is found in combination with a form of 'get'
	 * otherwise returns false.
	 */
	hasRidException( participle ) {
		if ( participle === "rid" ) {
			const irregularExclusionArray = [ "get", "gets", "getting", "got", "gotten" ];
			return ! isEmpty( intersection( irregularExclusionArray, this.getAuxiliaries() ) );
		}
		return false;
	}
}

export default FrenchClause;

