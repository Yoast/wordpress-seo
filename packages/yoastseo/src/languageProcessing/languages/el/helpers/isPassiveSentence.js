import { languageProcessing } from "yoastseo";
const { getWords, directPrecedenceException } = languageProcessing;

import nonPassiveVerbStems from "../config/internal/nonPassiveVerbStems";
import { passiveSuffixes } from "../config/internal/morphologicalPassiveSuffixes.js";

const directPrecedenceExceptionList = [ "να" ];

/**
 * Checks the passed sentence to see if it contains Greek passive verb-forms.
 *
 * @param {string} sentence     The sentence to match against.
 *
 * @returns {Boolean}           Whether the sentence is passive or not.
 */
export default function isPassiveSentence( sentence ) {
	const words = getWords( sentence );

	for ( const word of words ) {
		for ( const suffix of passiveSuffixes ) {
			if ( word.endsWith( suffix ) && word.length > 4 ) {
				// Get the stem of the word.
				const stem = word.slice( 0, -suffix.length );
				/*
				 * Return true if the word ends with one of the passive suffixes, if the word is more than 4 characters long
				 * And if the word stem is not in the non-passive exception list.
				 *
				 * Passive infinitive with -θεί/-τεί is not a valid passive if it's directly preceded by "να".
				 */
				return /^(θεί|τεί)$/.test( suffix )
					? ( ! nonPassiveVerbStems.includes( stem ) && ! directPrecedenceException( sentence, word, directPrecedenceExceptionList ) )
					: ! nonPassiveVerbStems.includes( stem );
			}
		}
	}
	return false;
}
