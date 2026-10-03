import { includes, intersection, isEmpty } from "lodash";
import {
	cannotBeBetweenPassiveAuxiliaryAndParticiple,
	cannotDirectlyPrecedePassiveParticiple,
} from "../config/functionWords";
import nonVerbsEndingEd from "../config/internal/passiveVoiceNonVerbEndingEd";
import getParticiples from "../helpers/internal/getParticiples";
import { languageProcessing } from "yoastseo";
const { precedenceException, directPrecedenceException, values } = languageProcessing;
const Clause = values.Clause;

/**
 * Creates a Clause object for the English language.
 */
class EnglishClause extends Clause {
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

export default EnglishClause;
