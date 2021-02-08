import getWords from "../../../helpers/word/getWords";
import getPassiveEndingsCzech from "../config/internal/passiveVoiceEndings";
const passiveEndingsCzech = getPassiveEndingsCzech();

/**
 * Checks the passed sentence to see if it contains Czech passive verb-forms.
 *
 * @param {string} sentence     The sentence to match against.
 *
 * @returns {Boolean} Whether the sentence contains Czech passive voice.
 */
export default function isPassiveSentence( sentence ) {
	const words = getWords( sentence.toLowerCase() );
	const matchedPassives = words.filter( word => ( word.length > 4 ) );
	return matchedPassives.some( word => passiveEndingsCzech.some( ending => word.endsWith( ending ) ) );
};
