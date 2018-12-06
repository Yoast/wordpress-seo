const addSuffixes = function( wordStem, suffixes ) {
	const suffixedForms = suffixes.map( suffix => wordStem.concat( suffix ) );

	return suffixedForms;
};

export function getNounForms( stem, morphologyDataNouns ) {
	const nounForms = addSuffixes( stem, morphologyDataNouns.regularSuffixes );
	return nounForms;
}
