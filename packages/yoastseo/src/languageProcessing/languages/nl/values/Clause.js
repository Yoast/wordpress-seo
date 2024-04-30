import { includes } from "lodash";
import { languageProcessing } from "yoastseo";
const { directPrecedenceException, values } = languageProcessing;
const { Clause } = values;

import { cannotDirectlyPrecedePassiveParticiple } from "../config/functionWords";
import nonParticiples from "../config/internal/nonParticiples";
import getParticiples from "../helpers/internal/getParticiples";

/**
 * Creates a Clause object for the Dutch language.
 */
class DutchClause extends Clause {
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
	 * If no exceptions are found and there is an auxiliary present, the clause is passive.
	 *
	 * @returns {void}
	 */
	checkParticiples() {
		const foundParticiples = this.getParticiples().filter( participle => {
			return ! includes( nonParticiples, participle ) &&
				! this.hasNonParticipleEnding( participle ) &&
				! directPrecedenceException( this.getClauseText(), participle, cannotDirectlyPrecedePassiveParticiple );
		} );

		this.setPassive( foundParticiples.length > 0 );
	}

	/**
	 * Checks whether a found participle has a non-participle ending and is therefore not really a participle.
	 *
	 * @param {string} participle   The participle to check.
	 *
	 * @returns {boolean} Returns true if the participle has a non-participle ending, otherwise returns false.
	 */
	hasNonParticipleEnding( participle ) {
		return ( /\S+(heid|teit|tijd)($|[ \n\r\t.,'()"+\-;!?:/»«‹›<>])/ig ).test( participle );
	}
}

export default DutchClause;
