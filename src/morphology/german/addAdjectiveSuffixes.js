import { uniq as unique } from "lodash-es";

/**
 * Returns a set of comparative suffixes depending on the ending of the stem.
 *
 * @param {Object}  morphologyDataAdjectives    The German morphology data for adjectives.
 * @param {string}  stemmedWord                 The stemmed word for which to get suffixes.
 *
 * @returns {string[]} The correct comparative suffixes for the given stem.
 */
export function getSuffixesComparative( morphologyDataAdjectives, stemmedWord ) {
	const takesREnding = morphologyDataAdjectives.takesComparativeREnding.slice();

	if ( takesREnding.some( ending => stemmedWord.endsWith( ending ) ) ) {
		return morphologyDataAdjectives.comparativeSuffixesR;
	}

	return morphologyDataAdjectives.comparativeSuffixesEr;
}

/**
 * Returns a set of superlative suffixes depending on the ending of the stem.
 *
 * @param {Object}  morphologyDataAdjectives    The German morphology data for adjectives.
 * @param {string}  stemmedWord                 The stemmed word for which to get suffixes.
 *
 * @returns {string[]} The correct superlative suffixes for the given stem.
 */
export function getSuffixesSuperlative( morphologyDataAdjectives, stemmedWord ) {
	const takesEstEnding = morphologyDataAdjectives.takesSuperlativeEstEnding.slice();

	if ( takesEstEnding.some( ending => stemmedWord.endsWith( ending ) ) ) {
		return morphologyDataAdjectives.superlativeSuffixesEst;
	}

	return morphologyDataAdjectives.superlativeSuffixesSt;
}

/**
 * Adds all regular declension suffixes to a stem.
 *
 * @param {Object}      morphologyDataAdjectives    The German morphology data for adjectives.
 * @param {string}      stemmedWord                 The stemmed word for which to get suffixes.
 *
 * @returns {string[]} The suffixed adjective forms.
 */
export function addRegularSuffixes( morphologyDataAdjectives, stemmedWord ) {
	const regularSuffixes = morphologyDataAdjectives.regularSuffixes.slice();

	return unique( regularSuffixes.map( suffix => stemmedWord.concat( suffix ) ) );
}

/**
 * Adds suffixes for comparative forms to a stem.
 *
 * @param {Object}      morphologyDataAdjectives    The German morphology data for adjectives.
 * @param {string}      stemmedWord                 The stemmed word for which to get suffixes.
 *
 * @returns {string[]} The suffixed adjective forms.
 */
export function addComparativeSuffixes( morphologyDataAdjectives, stemmedWord ) {
	const comparativeSuffixes = getSuffixesComparative( morphologyDataAdjectives, stemmedWord );

	return comparativeSuffixes.map( suffix => stemmedWord.concat( suffix ) );
}

/**
 * Adds suffixes for comparative and superlative forms to a stem.
 *
 * @param {Object}      morphologyDataAdjectives    The German morphology data for adjectives.
 * @param {string}      stemmedWord                 The stemmed word for which to get suffixes.
 *
 * @returns {string[]} The suffixed adjective forms.
 */
export function addSuperlativeSuffixes( morphologyDataAdjectives, stemmedWord ) {
	const superlativeSuffixes = getSuffixesSuperlative( morphologyDataAdjectives, stemmedWord );

	return superlativeSuffixes.map( suffix => stemmedWord.concat( suffix ) );
}

/**
 * Adds regular declension suffixes as well as suffixes for comparative and superlative forms to a stem.
 *
 * @param {Object}      morphologyDataAdjectives    The German morphology data for adjectives.
 * @param {string}      stemmedWord                 The stemmed word for which to get suffixes.
 *
 * @returns {string[]} The suffixed adjective forms.
 */
export function addAllAdjectiveSuffixes( morphologyDataAdjectives, stemmedWord ) {
	const regularSuffixes = morphologyDataAdjectives.regularSuffixes.slice();
	const comparativeSuffixes = getSuffixesComparative( morphologyDataAdjectives, stemmedWord );
	const superlativeSuffixes = getSuffixesSuperlative( morphologyDataAdjectives, stemmedWord );
	const suffixesToAdd = [ ...regularSuffixes, ...comparativeSuffixes, ...superlativeSuffixes ];

	return unique( suffixesToAdd.map( suffix => stemmedWord.concat( suffix ) ) );
}
