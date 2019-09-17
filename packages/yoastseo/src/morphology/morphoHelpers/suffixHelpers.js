/**
 * Modifies the stem if the stem ending matches one of the regexes from a given modification group.
 *
 * @param {string} stemmedWord The stem.
 * @param {array} modificationGroup The type of modification.
 * @returns {string} The modified stem.
 */
export function modifyStem( stemmedWord, modificationGroup ) {
	const neededReplacement = modificationGroup.find( replacement => stemmedWord.search( new RegExp( replacement[ 0 ] ) ) !== -1 );

	if ( typeof neededReplacement !== "undefined" ) {
		return stemmedWord.replace( new RegExp( neededReplacement[ 0 ] ), neededReplacement[ 1 ] );
	}
}

/**
 * Creates word forms from a list of given suffixes and a stem.
 *
 * @param {string}      stem                The stem on which to apply the suffixes.
 * @param {string[]}    suffixes            The suffixes to apply.
 * @param {string}      [appendToStem=""]   Optional material to append between the stem and the suffixes.
 *
 * @returns {string[]} The suffixed verb forms.
 */
export function applySuffixesToStem( stem, suffixes, appendToStem = "" ) {
	return suffixes.map( suffix => stem + appendToStem + suffix );
}

/**
 * Creates word forms by appending all given suffixes on each of the given stems.
 *
 * @param {string[]}    stems               The stems on which to apply the suffixes.
 * @param {string[]}    suffixes            The suffixes to apply.
 * @param {string}      [appendToStem=""]   Optional material to append between the stem and the suffixes.
 *
 * @returns {string[]} The suffixed verb forms.
 */
export function applySuffixesToStems( stems, suffixes, appendToStem = "" ) {
	return stems.reduce( ( list, stem ) => {
		const stemWithSuffixes = applySuffixesToStem( stem, suffixes, appendToStem );
		return list.concat( stemWithSuffixes );
	}, [] );
}
