/**
 * Creates word forms from a list of given suffixes and a stem.
 *
 * @param {string}      stemmedWord         The stemmed word on which to apply the suffixes.
 * @param {string[]}    suffixes            The suffixes to apply.
 * @param {string}      [appendToStem=""]   Optional material to append between the stem and the suffixes.
 *
 * @returns {string[]} The suffixed verb forms.
 */
export function applySuffixes( stemmedWord, suffixes, appendToStem = "" ) {
	return suffixes.map( suffix => stemmedWord.concat( appendToStem ).concat( suffix ) );
}
