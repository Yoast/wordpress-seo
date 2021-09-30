import { languageProcessing } from "yoastseo";
const { values } = languageProcessing;
const { Clause } = values;
import getParticiples from "../helpers/internal/getParticiples";
import passiveAuxiliaries from "../config/internal/auxiliaries.js";
const auxiliariesToHave = passiveAuxiliaries.auxiliariesToHave;
const auxiliariesToBe = passiveAuxiliaries.auxiliariesToBe;

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
		this.getAuxiliaries();
	}
	checkParticiples() {

	}
}


export default GreekClause;
