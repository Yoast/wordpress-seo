import { languageProcessing } from "yoastseo";
const { getWords } = languageProcessing;

import nonPassiveVerbStems from "../config/internal/nonPassiveVerbStems";
import { passiveSuffixes } from "../config/internal/mophologicalPassiveSuffixes.js";



/**
 * Checks the passed sentence to see if it contains Greek passive verb-forms.
 *
 * @param {string} sentence     The sentence to match against.
 *
 * @returns {Boolean}           Whether the sentence contains Greek passive voice.
 */
export default function isPassiveSentence( sentence ) {
	const words = getWords( sentence );
	// Loop over the words array.
	for ( const word of words ) {
		// For each word we need to get the stem, if the word ends in one of the suffixes.
		for ( const suffix of passiveSuffixes ) {
			// If the stem is on the nonPassive stem list, the word is not a passive. Otherwise, it is.
			if ( word.endsWith( suffix ) && word.length > 4 ) {
				const stem = word.slice( 0, -suffix.length );
				return ! nonPassiveVerbStems.includes( stem );
			}
		}
	}
	return false;
}
