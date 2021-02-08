import getWords from "../../../helpers/word/getWords";
import passiveVerbs from "../config/internal/odikVerbs";
import { verbPrefixes, odikSuffixes1, odikSuffixes2 } from "../config/internal/morphologicalPassiveAffixes";

/**
 * Checks if the input word's root is in the Hungarian verb roots list.
 *
 * @param {string} word             The word to check.
 * @param {string[]} verbRootsList  The Hungarian verb roots list.
 * @param {string[]} prefixes       The list of prefixes.
 * @param {string[]} suffixes       The list of suffixes.
 *
 * @returns {Boolean}               Returns true if the root of the input word is in the list.
 */
const checkHungarianPassive = function( word, verbRootsList, prefixes, suffixes ) {
	return verbRootsList.some( root => {
		return suffixes.some( function( suffix ) {
			const rootAndSuffix = root + suffix;

			// Check whether the word ends in a root + suffix combination.
			if ( word.endsWith( rootAndSuffix ) ) {
				const beforeRoot = word.slice( 0, word.indexOf( rootAndSuffix ) );

				// Word is passive if nothing precedes the root or the root is preceded by a valid prefix.
				return beforeRoot === "" || prefixes.includes( beforeRoot );
			}
		} );
	} );
};

/**
 * Checks the passed sentence to see if it contains Hungarian passive verb-forms.
 *
 * @param {string} sentence     The sentence to match against.
 *
 * @returns {Boolean}           Whether the sentence contains Hungarian passive voice.
 */
export default function isPassiveSentence( sentence ) {
	const words = getWords( sentence );
	const passiveVerbs1 = passiveVerbs.odikVerbStems1;
	const passiveVerbs2 = passiveVerbs.odikVerbStems2;

	for ( const word of words ) {
		const checkPassiveVerb1 = checkHungarianPassive( word, passiveVerbs1, verbPrefixes, odikSuffixes1 );
		if ( checkPassiveVerb1 ) {
			return true;
		}

		const  checkPassiveVerbs2 = checkHungarianPassive( word, passiveVerbs2, verbPrefixes, odikSuffixes2 );
		if ( checkPassiveVerbs2 ) {
			return true;
		}
	}

	return false;
};
