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
