import { applySuffixesToStem } from "../morphoHelpers/suffixHelpers";
const endsInDT = /[dt]$/;
const endsInConsMN = /[tkbdgzfv][mn]$/;
const endsInChMN = /ch[mn]$/;
const endsInSZT = /[szßt]$/;
const endsInNonVerbEnding = /[aoycjw]$/;


/**
 * Adds verb suffixes to a stem. Depending on the ending of the stem, the list of suffixes might be modified.
 *
 * @param {Object}  morphologyDataVerbs     The German morphology data for verbs.
 * @param {string}  stemmedWord             The stemmed word on which to apply the suffixes.
 *
 * @returns {string[]} The suffixed verb forms.
 */
export function addVerbSuffixes( morphologyDataVerbs, stemmedWord ) {
	let allVerbSuffixes = morphologyDataVerbs.verbSuffixes.slice();

	// Check whether the stem has an ending that only takes suffixes starting in e-.
	if ( ( endsInDT ).test( stemmedWord ) ||
		( endsInConsMN ).test( stemmedWord ) ||
		( endsInChMN ).test( stemmedWord ) ) {
		allVerbSuffixes = allVerbSuffixes.filter( suffix => suffix.startsWith( "e" ) );

		return applySuffixesToStem( stemmedWord, allVerbSuffixes );
	}

	// Check whether the stem has an ending that doesn't take the suffix -st.
	if ( ( endsInSZT ).test( stemmedWord ) ) {
		allVerbSuffixes = allVerbSuffixes.filter( suffix => suffix !== "st" );

		return applySuffixesToStem( stemmedWord, allVerbSuffixes );
	}

	// Check whether the stem has an ending that marks it as a non-verbal stem.
	if ( ( endsInNonVerbEnding ).test( stemmedWord ) ) {
		return [];
	}

	return applySuffixesToStem( stemmedWord, allVerbSuffixes );
}
