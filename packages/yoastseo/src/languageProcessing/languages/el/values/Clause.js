import { languageProcessing } from "yoastseo";
const { values, directPrecedenceException } = languageProcessing;
const { Clause } = values;
import getParticiples from "../helpers/internal/getParticiples";
import { auxiliariesToHave, auxiliariesToBe } from "../config/internal/auxiliaries.js";

const directPrecedenceExceptionList = [ "να" ];

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
	 *
	 * @returns {void}
	 */
	checkParticiples() {
		const participles = this.getParticiples();

		const matchedParticiple = this.getAuxiliaries().some( auxiliary => participles.some( participle =>
			this.checkExceptions( auxiliary, participle ) ) );

		this.setPassive( matchedParticiple );
	}

	/**
	 * Checks if any exceptions are applicable to this participle that would result in the clause not being passive.
	 * If no exceptions are found, the clause is passive.
	 *
	 * In Greek periphrastic construction, the clause is passive if the clause contains:
	 * (a) auxiliary "to be" + passive participle
	 * (b) auxiliary "to have" + passive infinitive, and the infinitive should not be preceded by 'να'
	 *
	 * @param {string} auxiliary    The auxiliary to check.
	 * @param {object} participle   The participle object to check.
	 *
	 * @returns {boolean}   Whether or not the matched participle is a passive one.
	 */
	checkExceptions( auxiliary, participle ) {
		const clause = this.getClauseText();

		return ( auxiliariesToHave.includes( auxiliary ) && participle.type === "infinitive" &&
			! directPrecedenceException( clause, participle.passives[ 0 ], directPrecedenceExceptionList ) ) ||
			( auxiliariesToBe.includes( auxiliary ) && participle.type === "participle" );
	}
}


export default GreekClause;
