import { languageProcessing } from "yoastseo";
const { values } = languageProcessing;
const { Clause } = values;
import getParticiples from "../helpers/internal/getParticiples";
import nonPassives from "../../sk/config/internal/nonPassives";

/**
 * Creates a Clause object for the Slovak language.
 */
class SlovakClause extends Clause {
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
		const foundParticiples = this.getParticiples().filter( participle => ! nonPassives.includes( participle ) );
		this.setPassive( foundParticiples.length > 0 );
	}
}

export default SlovakClause;
