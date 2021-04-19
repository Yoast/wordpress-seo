import {
	cannotBeBetweenPassiveAuxiliaryAndParticiple,
	cannotDirectlyPrecedePassiveParticiple,
} from "../config/functionWords";
import getParticiples from "../helpers/internal/getParticiples";
import { languageProcessing } from "yoastseo";
const { precedenceException, directPrecedenceException, values } = languageProcessing;
const Clause = values.Clause;

/**
 * Creates a Clause object for the Spanish language.
 */
class SpanishClause extends Clause {
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
* @returns { void }
*/
	checkParticiples() {
		const clause = this.getClauseText();

		const passiveParticiples = this.getParticiples().filter( participle =>
			! directPrecedenceException( clause, participle, cannotDirectlyPrecedePassiveParticiple ) &&
			! precedenceException( clause, participle, cannotBeBetweenPassiveAuxiliaryAndParticiple ) );

		this.setPassive( passiveParticiples.length > 0 );
	}
}

export default SpanishClause;
