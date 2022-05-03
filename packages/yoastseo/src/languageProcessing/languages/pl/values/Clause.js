import getParticiples from "../helpers/internal/getParticiples.js";
import { languageProcessing } from "yoastseo";
const { nonDirectPrecedenceException, directPrecedenceException, values } = languageProcessing;
const { Clause } = values;
import { cannotBeBetweenPassiveAuxiliaryAndParticiple, cannotDirectlyPrecedePassiveParticiple } from "../config/functionWords";

/**
 * Creates a Clause object for the Polish language.
 */
class PolishClause extends Clause {
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
		const auxiliaries = this.getAuxiliaries();

		const passiveParticiples = this.getParticiples().filter( participle =>
			! directPrecedenceException( clause, participle, cannotDirectlyPrecedePassiveParticiple ) &&
			! nonDirectPrecedenceException( clause, participle, auxiliaries, cannotBeBetweenPassiveAuxiliaryAndParticiple ) );

		this.setPassive( passiveParticiples.length > 0 );
	}
}


export default PolishClause;

