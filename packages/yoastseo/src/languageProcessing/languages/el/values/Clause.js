import { languageProcessing } from "yoastseo";
const { values } = languageProcessing;
const { Clause } = values;
import getParticiples from "../helpers/internal/getParticiples";
import { auxiliariesToHave, auxiliariesToBe } from "../config/internal/auxiliaries.js";

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
	 * Checks if any exceptions are applicable to this participle that would result in the clause not being passive.
	 * If no exceptions are found, the clause is passive.
	 *
	 * In Greek periphrastic construction, the clause is passive if the clause contains:
	 * (a) auxiliary "to be" + passive participle
	 * (b) auxiliary "to have" + passive infinitive
	 *
	 * @returns {void}
	 */
	checkParticiples() {
		const participles = this.getParticiples();

		const matchedParticiple = this.getAuxiliaries().some( auxiliary => participles.some( participle =>
			( auxiliariesToHave.includes( auxiliary ) && participle.type === "infinitive" ) ||
			( auxiliariesToBe.includes( auxiliary ) && participle.type === "participle" ) ) );

		this.setPassive( matchedParticiple );
	}
}


export default GreekClause;
