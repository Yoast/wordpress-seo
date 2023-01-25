import { languageProcessing } from "yoastseo";
const { values } = languageProcessing;
const { Clause } = values;
import getParticiples from "../helpers/internal/getParticiples";

/**
 * Creates a Clause object for the Greek language.
 */
class GreekClause extends Clause {
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
	 * Sets the passiveness of a clause based on whether the matched participle is a valid one.
	 * We only process clauses that have an auxiliary in this check.
	 *
	 * @returns {void}
	 */
	checkParticiples() {
		const participles = this.getParticiples();

		this.setPassive( participles.length > 0 );
	}
}


export default GreekClause;
