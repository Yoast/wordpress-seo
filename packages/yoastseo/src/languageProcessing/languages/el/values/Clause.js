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
	checkParticiples() {

	}
}


export default GreekClause;
