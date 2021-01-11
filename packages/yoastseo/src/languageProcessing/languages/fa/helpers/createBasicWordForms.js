import { searchAndReplaceWithRegex } from "../../../helpers/morphology/regexHelpers";
/**
 * Creates the basic affixed-forms of a given Farsi word
 *
 * @param {string} word      The word to check
 *
 * @returns {Array} The created forms
 */
const createForms = function( word ) {
	const prefix = "ن";
	// Regular suffixes
	const suffixes1 = [ "مان", "شان", "تان", "ش", "ت", "م", "ی" ];
	// Suffixes for words that end in ا or و
	const suffixes2 = [ "یی", "یم", "یت", "یش" ];
	// Suffixes for words that end in silent ه
	const suffixes3 = [ "‌ای", "‌یی", "‌ام", "‌ات", "‌اش" ];
	// Suffixes for words that end in ها
	const suffixes4 = [ "یی", "ی" ];

	const createdForms = [];

	// Create prefixed form.
	createdForms.push( prefix + word );

	// Create suffixed forms using suffixes from one of the four groups, depending on the word's ending.
	if ( word.endsWith( "ها" ) ) {
		createdForms.push( ...suffixes4.map( suffix => word + suffix ) );
	} else if ( /([^وای]ه)$/i.test( word ) ) {
		createdForms.push( ...suffixes3.map( suffix => word + suffix ) );
	} else if ( /([وا])$/i.test( word ) ) {
		createdForms.push( ...suffixes2.map( suffix => word + suffix ) );
	} else {
		if ( word.endsWith( "ی" )  ) {
			createdForms.push( word + "‌ای" );
		}
		createdForms.push( ...suffixes1.map( suffix => word + suffix ) );
	}
	return createdForms;
};

/**
 * Stem the basic affixes of a given Farsi word
 *
 * @param {string} word  The word to check
 *
 * @returns {string}    The stemmed word
 */
const stemWord = function( word ) {
	const prefix = "ن";
	const suffixesAndReplacements = [
		[ "(و|ا)(یش|یت|یم|یی)$", "$1" ],
		[ "([^وای]ه)(‌یی|‌ای|‌اش|‌ات|‌ام)$", "$1" ],
		[ "(ی)‌ای$", "$1" ],
		[ "(ها)یی$", "$1" ],
		[ "(مان|شان|تان|ش|ت|م|ی)$", "" ],
	];
	// Remove prefix.
	if ( word.startsWith( prefix ) ) {
		return word.slice( 1, word.length );
	}
	// Search for and remove suffixes.
	return searchAndReplaceWithRegex( word, suffixesAndReplacements );
};

/**
 * Creates basic word forms for a given Farsi word.
 *
 * @param {string} word     The word for which to create basic word forms.
 *
 * @returns {Array}        Prefixed and de-prefixed variations of a word.
 */
export default function createBasicWordForms( word ) {
	const forms = [];

	/*
	 * Add prefixes and suffixes to the input word. We always do this, since some words
	 * beginning with an affix-like letter might be exceptions where this is the
	 * actual first letter or last letter of the word.
	 */

	forms.push( ...createForms( word ) );

	/*
	 * If a word starts with a prefix or is it ends with one of the suffixes, we strip it and create all possible
	 * affixed forms based on this stem.
	 */
	const stemmedWord = stemWord( word );
	if ( stemmedWord ) {
		forms.push( stemmedWord );
		forms.push( ...createForms( stemmedWord ) );
	}
	return forms;
}
