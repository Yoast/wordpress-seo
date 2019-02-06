import { uniq as unique } from "lodash-es";


const removeSuffixesIfWordEndsInConsonant = function( stemmedWord, suffixList, suffixesToRemove ) {
	const consonantAtEndOfWord = /[b-df-hj-kmnpqstv-xzß]$/;

	for ( let i = 0; i < suffixesToRemove.length; i++ ) {
		if ( consonantAtEndOfWord.test( stemmedWord ) ) {
			suffixList = suffixList.filter( suffix => suffix !== "n" );
		}
	}

	return suffixList;
};

export function getSuffixesComparative( morphologyDataAdjectives, stemmedWord ) {
	const takesREnding = morphologyDataAdjectives.takesComparativeREnding.slice();

	if ( takesREnding.some( ending => stemmedWord.endsWith( ending ) ) ) {
		return morphologyDataAdjectives.comparativeSuffixesR;
	}

	return morphologyDataAdjectives.comparativeSuffixesEr;
}

export function getSuffixesSuperlative( morphologyDataAdjectives, stemmedWord ) {
	const takesEstEnding = morphologyDataAdjectives.takesSuperlativeEstEnding.slice();

	if ( takesEstEnding.some( ending => stemmedWord.endsWith( ending ) ) ) {
		return morphologyDataAdjectives.superlativeSuffixesEst;
	}

	return morphologyDataAdjectives.superlativeSuffixesSt;
}

export function addRegularSuffixes( morphologyDataAdjectives, stemmedWord, suffixesToRemove = [] ) {
	const regularSuffixes = morphologyDataAdjectives.regularSuffixes.slice();
	let suffixesToAdd = regularSuffixes.filter( suffix => suffixesToRemove.indexOf( suffix ) === -1 );

	// Delete -n from regular suffixes if the word ends in a consonant (except l and r).
	suffixesToAdd = removeSuffixesIfWordEndsInConsonant( stemmedWord, suffixesToAdd, [ "n" ] );

	return unique( suffixesToAdd.map( suffix => stemmedWord.concat( suffix ) ) );
}

export function addComparativeSuperlativeSuffixes( morphologyDataAdjectives, stemmedWord, suffixesToRemove = [] ) {
	const comparativeSuffixes = getSuffixesComparative( morphologyDataAdjectives, stemmedWord );
	const superlativeSuffixes = getSuffixesSuperlative( morphologyDataAdjectives, stemmedWord );
	let suffixesToAdd = [ ...comparativeSuffixes, ...superlativeSuffixes ];
	suffixesToAdd = suffixesToAdd.filter( suffix => suffixesToRemove.indexOf( suffix ) === -1 );

	return unique( suffixesToAdd.map( suffix => stemmedWord.concat( suffix ) ) );
}

export function addAllAdjectiveSuffixes( morphologyDataAdjectives, stemmedWord, suffixesToRemove = [] ) {
	const regularSuffixes = morphologyDataAdjectives.regularSuffixes.slice();
	const comparativeSuffixes = getSuffixesComparative( morphologyDataAdjectives, stemmedWord );
	const superlativeSuffixes = getSuffixesSuperlative( morphologyDataAdjectives, stemmedWord );
	let suffixesToAdd = [ ...regularSuffixes, ...comparativeSuffixes, ...superlativeSuffixes ];
	suffixesToAdd = suffixesToAdd.filter( suffix => suffixesToRemove.indexOf( suffix ) === -1 );

	// Delete -n from regular suffixes if the word ends in a consonant (except l and r).
	suffixesToAdd = removeSuffixesIfWordEndsInConsonant( stemmedWord, suffixesToAdd, [ "n" ] );

	return unique( suffixesToAdd.map( suffix => stemmedWord.concat( suffix ) ) );
}
