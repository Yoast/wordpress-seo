import { languageProcessing } from "yoastseo";
import getParticiples from "../helpers/internal/getParticiples";
const { values } = languageProcessing;
const { Clause } = values;

/**
 * Creates a Clause object for the Czech language.
 */
class CzechClause extends Clause {
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
	 * Sets the clause passiveness to true if both auxiliary and participle present in the clause, otherwise sets it to false.
	 *
	 * @returns {void}
	 */
	checkParticiples() {
		this.setPassive( this.getAuxiliaries().length > 0 && this.getParticiples().length > 0 );
	}
}

export default CzechClause;
