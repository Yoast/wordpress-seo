import { includes } from "lodash";
import getParticiples from "../helpers/internal/getParticiples.js";
import { languageProcessing } from "yoastseo";
const { precedenceException, directPrecedenceException, values } = languageProcessing;
const { Clause } = values;
import { cannotBeBetweenPassiveAuxiliaryAndParticiple, cannotDirectlyPrecedePassiveParticiple } from "../config/functionWords";
import {
	adjectivesVerbs as exceptionsParticiplesAdjectivesVerbs,
	nouns as exceptionsParticiplesNouns,
	others as exceptionsParticiplesOthers,
} from "../config/internal/exceptionsParticiplesActive";

/**
 * Creates a Clause object for the French language.
 */
class FrenchClause extends Clause {
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

		const passiveParticiples = this.getParticiples().filter( participle => ! participle.startsWith( "l'" ) && ! participle.startsWith( "d'" ) &&
			! includes( exceptionsParticiplesOthers, participle ) &&
			! this.isOnAdjectiveVerbExceptionList( participle ) &&
			! this.isOnNounExceptionList( participle ) &&
			! directPrecedenceException( clause, participle, cannotDirectlyPrecedePassiveParticiple ) &&
			! precedenceException( clause, participle, cannotBeBetweenPassiveAuxiliaryAndParticiple ) );

		this.setPassive( passiveParticiples.length > 0 );
	}

	/**
	 * Checks whether the participle is on an exception list of words that look like participles but are adjectives or verbs.
	 *
	 * @param {string}	participle	The participle to check.
	 *
	 * @returns {boolean}	Whether or not the participle is on the adjective and verb exception list.
	 */
	isOnAdjectiveVerbExceptionList( participle ) {
		if ( exceptionsParticiplesAdjectivesVerbs.includes( participle ) ) {
			return true;
		}
		// Checks for and removes a suffix and checks the exception list again.
		if ( participle.endsWith( "es" ) ) {
			participle = participle.slice( 0, -2 );
		} else if ( participle.endsWith( "e" ) || participle.endsWith( "s" ) ) {
			participle = participle.slice( 0, -1 );
		}
		return exceptionsParticiplesAdjectivesVerbs.includes( participle );
	}

	/**
	 * Checks whether the participle is on an exception list of words that look like participles but are nouns.
	 *
	 * @param {string}	participle	The participle to check.
	 *
	 * @returns {boolean}	Whether or not the participle is on the noun exception list.
	 */
	isOnNounExceptionList( participle ) {
		if ( exceptionsParticiplesNouns.includes( participle ) ) {
			return true;
		}
		// Checks for and removes a suffix and checks the exception list again.
		if ( participle.endsWith( "s" ) ) {
			participle = participle.slice( 0, -1 );
		}
		return exceptionsParticiplesNouns.includes( participle );
	}
}


export default FrenchClause;

