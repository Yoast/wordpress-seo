import regularRootsHufal from "../config/internal/regularRootsHufal";
import regularRootsNifal from "../config/internal/regularRootsNifal";
import regularRootsPual from "../config/internal/regularRootsPual";
import getWords from "../../../helpers/word/getWords";

/**
* Checks if the input word's root is in the Hebrew verb roots list.
*
* @param {string} word             The word to check.
* @param {string[]} verbRootsList  The Hebrew verb roots list.
* @param {Object[]} affixesList    The list of prefixes and suffixes.
*
* @returns {Boolean}           Returns true if the root of the input word is in the list.
*/
const checkHebrewVerbRootsList = function( word, verbRootsList, affixesList ) {
	return verbRootsList.some( root => affixesList.some( function( affixes ) {
		const pattern =  new RegExp( "^" + affixes.prefix + root + affixes.suffix + "$" );
		return pattern.test( word );
	} ) );
};

/**
 * Checks the passed sentence to see if it contains Hebrew passive verb-forms.
 *
 * @param {string} sentence    The sentence to match against.
 *
 * @returns {Boolean}          Whether the sentence contains Hebrew passive voice.
 */
export default function isPassiveSentence( sentence ) {
	const words = getWords( sentence );
	for ( const word of words ) {
		// The list of prefixes and suffixes for nif'al.
		const nifalAffixes =  [
			{ prefix: "(נ|אי|תי|הי|יי|ני|להי)", suffix: "" },
			{ prefix: "(תי|הי)", suffix: "(י|ו|נה)" },
			{ prefix: "נ", suffix: "(ים|ת|ות|תי|ה|נו|תם|תן|ו)" },
			{ prefix: "יי", suffix: "ו" },
		];

		// Check if the root is in nif'al.
		const nifalPassive = checkHebrewVerbRootsList( word, regularRootsNifal, nifalAffixes );

		if ( nifalPassive ) {
			return true;
		}

		// The list of prefixes and suffixes for pu'al.
		const pualAffixes = [
			{ prefix: "(מ|א|ת|י|נ)", suffix: "" },
			{ prefix: "תי", suffix: "נה" },
			{ prefix: "מ", suffix: "(ת|ים|ות)" },
			{ prefix: "ת", suffix: "(י|ו|נה)" },
			{ prefix: "י", suffix: "ו" },
			{ prefix: "", suffix: "(תי|ת|ה|נו|תם|תן|ו)" },
			{ prefix: "", suffix: "" },
		];
		const pualInfix = "ו";

		// Check if the root is in pu'al.
		const pualPassive = regularRootsPual.some( root => pualAffixes.some( function( affixes ) {
			const pualPattern = new RegExp( "^" + affixes.prefix + root[ 0 ] + pualInfix + root[ 1 ] + root[ 2 ] + affixes.suffix + "$" );

			return pualPattern.test( word );
		} ) );

		if ( pualPassive ) {
			return true;
		}

		// The list of prefixes and suffixes for huf'al.
		const hufalAffixes = [
			{ prefix: "(מו|הו|או|תו|יו|נו)", suffix: "" },
			{ prefix: "מו", suffix: "(ת|ים|ות)" },
			{ prefix: "הו", suffix: "(תי|ת|ית|ה|נו|תם|תן|ו)" },
			{ prefix: "תו", suffix: "(ו|נה|י)" },
			{ prefix: "יו", suffix: "ו" },
		];

		// Check if the root is in huf'al.
		const hufalPassive = checkHebrewVerbRootsList( word, regularRootsHufal, hufalAffixes );

		if ( hufalPassive ) {
			return true;
		}
	}

	return false;
}
