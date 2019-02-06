import { uniq as unique } from "lodash-es";

/**
 * Removes certain suffixes if a given adjective ends in a consonant.
 *
 * @param {string}      stemmedWord         The stemmed word for which to check the ending.
 * @param {string[]}    suffixList          The suffix list to filter.
 * @param {string[]}    suffixesToRemove    The suffixes to remove from the suffix list.
 *
 * @returns {string[]} The filtered suffix list.
 */
const removeSuffixesIfWordEndsInConsonant = function( stemmedWord, suffixList, suffixesToRemove ) {
	const consonantAtEndOfWord = /[b-df-hj-np-tv-xzß]$/;

	for ( let i = 0; i < suffixesToRemove.length; i++ ) {
		if ( consonantAtEndOfWord.test( stemmedWord ) ) {
			suffixList = suffixList.filter( suffix => suffix !== "n" );
		}
	}

	return suffixList;
};

/**
 * Returns a set of comparative suffixes depending on the ending of the stem.
 *
 * @param {Object}  morphologyDataAdjectives    The German morphology data for nouns.
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
 * @param {Object}  morphologyDataAdjectives    The German morphology data for nouns.
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
 * @param {Object}      morphologyDataAdjectives    The German morphology data for nouns.
 * @param {string}      stemmedWord                 The stemmed word for which to get suffixes.
 * @param {string[]}    [suffixesToRemove=[]]       The suffixes that shouldn't be added.
 *
 * @returns {string[]} The suffixed adjective forms.
 */
export function addRegularSuffixes( morphologyDataAdjectives, stemmedWord, suffixesToRemove = [] ) {
	const regularSuffixes = morphologyDataAdjectives.regularSuffixes.slice();
	let suffixesToAdd = regularSuffixes.filter( suffix => suffixesToRemove.indexOf( suffix ) === -1 );

	suffixesToAdd = removeSuffixesIfWordEndsInConsonant( stemmedWord, suffixesToAdd, [ "n" ] );

	return unique( suffixesToAdd.map( suffix => stemmedWord.concat( suffix ) ) );
}

/**
 * Adds suffixes for comparative and superlative forms to a stem.
 *
 * @param {Object}      morphologyDataAdjectives    The German morphology data for nouns.
 * @param {string}      stemmedWord                 The stemmed word for which to get suffixes.
 * @param {string[]}    [suffixesToRemove=[]]       The suffixes that shouldn't be added.
 *
 * @returns {string[]} The suffixed adjective forms.
 */
export function addComparativeSuperlativeSuffixes( morphologyDataAdjectives, stemmedWord, suffixesToRemove = [] ) {
	const comparativeSuffixes = getSuffixesComparative( morphologyDataAdjectives, stemmedWord );
	const superlativeSuffixes = getSuffixesSuperlative( morphologyDataAdjectives, stemmedWord );
	let suffixesToAdd = [ ...comparativeSuffixes, ...superlativeSuffixes ];
	suffixesToAdd = suffixesToAdd.filter( suffix => suffixesToRemove.indexOf( suffix ) === -1 );

	return unique( suffixesToAdd.map( suffix => stemmedWord.concat( suffix ) ) );
}

/**
 * Adds regular declension suffixes as well as suffixes for comparative and superlative forms to a stem.
 *
 * @param {Object}      morphologyDataAdjectives    The German morphology data for nouns.
 * @param {string}      stemmedWord                 The stemmed word for which to get suffixes.
 * @param {string[]}    [suffixesToRemove=[]]       The suffixes that shouldn't be added.
 *
 * @returns {string[]} The suffixed adjective forms.
 */
export function addAllAdjectiveSuffixes( morphologyDataAdjectives, stemmedWord, suffixesToRemove = [] ) {
	const regularSuffixes = morphologyDataAdjectives.regularSuffixes.slice();
	const comparativeSuffixes = getSuffixesComparative( morphologyDataAdjectives, stemmedWord );
	const superlativeSuffixes = getSuffixesSuperlative( morphologyDataAdjectives, stemmedWord );
	let suffixesToAdd = [ ...regularSuffixes, ...comparativeSuffixes, ...superlativeSuffixes ];
	suffixesToAdd = suffixesToAdd.filter( suffix => suffixesToRemove.indexOf( suffix ) === -1 );

	suffixesToAdd = removeSuffixesIfWordEndsInConsonant( stemmedWord, suffixesToAdd, [ "n" ] );

	return unique( suffixesToAdd.map( suffix => stemmedWord.concat( suffix ) ) );
}
