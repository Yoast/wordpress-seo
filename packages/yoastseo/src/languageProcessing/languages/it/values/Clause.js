import { languageProcessing } from "yoastseo";
import { cannotDirectlyPrecedePassiveParticiple,
	cannotBeBetweenPassiveAuxiliaryAndParticiple,
} from "../config/functionWords.js";
import getParticiples from "../helpers/internal/getParticiples.js";
const { directPrecedenceException, precedenceException, values } = languageProcessing;
const { Clause } = values;

/**
 * Creates a Clause object for the Italian language.
 */
class ItalianClause extends Clause {
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
	 * Checks if any exceptions are applicable to this participle that would result in the sentence part not being passive.
	 * If no exceptions are found, the sentence part is passive.
	 *
	 * @returns {boolean} Returns true if no exception is found.
	 */
	checkParticiples() {
		const clause = this.getClauseText();

		const passiveParticiples = this.getParticiples().filter( participle =>
			! directPrecedenceException( clause, participle, cannotDirectlyPrecedePassiveParticiple ) &&
			! precedenceException( clause, participle, cannotBeBetweenPassiveAuxiliaryAndParticiple ) );

		this.setPassive( passiveParticiples.length > 0 );
	}
}

export default ItalianClause;


