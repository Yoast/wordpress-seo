import { languageProcessing } from "yoastseo";
import { cannotDirectlyPrecedePassiveParticiple } from "../config/functionWords";
import getParticiples from "../helpers/internal/getParticiples";
const { directPrecedenceException, values } = languageProcessing;
const { Clause } = values;

/**
 * Creates a Clause object for the Portuguese language.
 */
class PortugueseClause extends Clause {
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
	 * @returns {void}
	 */
	checkParticiples() {
		const clause = this.getClauseText();

		const foundParticiples = this.getParticiples().filter( participle =>
			! directPrecedenceException( clause, participle, cannotDirectlyPrecedePassiveParticiple ) );

		this.setPassive( foundParticiples.length > 0 );
	}
}

export default PortugueseClause;
