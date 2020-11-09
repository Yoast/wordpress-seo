import nonPassives from "../config/internal/nonPassiveVerbsStartingDi";
import getWords from "../../../helpers/word/getWords";
const passivePrefix = "di";

/**
 * Checks the passed sentence to see if it contains Indonesian passive verb-forms.
 *
 * @param {string} sentence The sentence to match against.
 * @returns {Boolean} Whether the sentence contains Indonesian passive voice.
 */
export default function isPassiveSentence( sentence ) {
	const words = getWords( sentence );
	let matchedPassives = words.filter( word => ( word.length > 4 ) );
	matchedPassives = matchedPassives.filter( word => ( word.startsWith( passivePrefix ) ) );
	if ( matchedPassives.length === 0 ) {
		return false;
	}

	// Check exception list.
	for ( const nonPassive of nonPassives ) {
		matchedPassives = matchedPassives.filter( word => ( ! word.startsWith( nonPassive ) ) );
	}

	// Check direct precedence exceptions.
	matchedPassives = matchedPassives.filter( function( matchedPassive ) {
		let matchedPassivesShouldStay = true;
		const passiveIndex = words.indexOf( matchedPassive );
		const wordPrecedingPassive = words[ passiveIndex - 1 ];
		if ( wordPrecedingPassive === "untuk" ) {
			matchedPassivesShouldStay = false;
		}
		return matchedPassivesShouldStay;
	} );

	return matchedPassives.length !== 0;
}
