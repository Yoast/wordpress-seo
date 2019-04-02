/**
 * Adds suffixes to the list of regular suffixes.
 *
 * @param {Object}          morphologyDataSuffixAdditions   The German data for suffix additions.
 * @param {Array<string>}   regularSuffixes                 All regular suffixes for German.
 * @param {string}          stemmedWordToCheck              The stem to check.
 *
 * @returns {Array<string>} The modified list of regular suffixes.
 */
const addSuffixesToRegulars = function( morphologyDataSuffixAdditions, regularSuffixes, stemmedWordToCheck ) {
	for ( const key of Object.keys( morphologyDataSuffixAdditions ) ) {
		const endingsToCheck = morphologyDataSuffixAdditions[ key ][ 0 ];
		const suffixesToAdd = morphologyDataSuffixAdditions[ key ][ 1 ];

		// Append to the regular suffixes if one of the endings match.
		if ( endingsToCheck.some( ending => stemmedWordToCheck.endsWith( ending ) ) ) {
			regularSuffixes = regularSuffixes.concat( suffixesToAdd );
		}
	}

	return regularSuffixes;
};

/**
 * Deletes suffixes from the list of regular suffixes.
 *
 * @param {Object}          morphologyDataSuffixDeletions   The German data for suffix deletions.
 * @param {Array<string>}   regularSuffixes                 All regular suffixes for German.
 * @param {string}          stemmedWordToCheck              The stem to check.
 *
 * @returns {Array<string>} The modified list of regular suffixes.
 */
const removeSuffixesFromRegulars = function( morphologyDataSuffixDeletions, regularSuffixes, stemmedWordToCheck ) {
	for ( const key of Object.keys( morphologyDataSuffixDeletions ) ) {
		const endingsToCheck = morphologyDataSuffixDeletions[ key ][ 0 ];
		const suffixesToDelete = morphologyDataSuffixDeletions[ key ][ 1 ];

		// Delete from the regular suffixes if one of the endings match.
		if ( endingsToCheck.some( ending => stemmedWordToCheck.endsWith( ending ) ) ) {
			regularSuffixes = regularSuffixes.filter( ending => ! suffixesToDelete.includes( ending ) );
		}
	}

	return regularSuffixes;
};

/**
 * Adds or removes suffixes from the list of regulars depending on the ending of the stem checked.
 *
 * @param {Object}          morphologyDataNouns The German morphology data for nouns.
 * @param {Array<string>}   regularSuffixes     All regular suffixes for German.
 * @param {string}          stemmedWordToCheck  The stem to check.
 *
 * @returns {Array<string>} The modified list of regular suffixes.
 */
const modifyListOfRegularSuffixes = function( morphologyDataNouns, regularSuffixes, stemmedWordToCheck ) {
	const additions = morphologyDataNouns.regularSuffixAdditions;
	const deletions = morphologyDataNouns.regularSuffixDeletions;

	regularSuffixes = addSuffixesToRegulars( additions, regularSuffixes, stemmedWordToCheck );
	regularSuffixes = removeSuffixesFromRegulars( deletions, regularSuffixes, stemmedWordToCheck );

	return regularSuffixes;
};

/**
 * Add forms based on changes other than simple suffix concatenations.
 *
 * @param {Object}  morphologyDataNouns The German morphology data for nouns.
 * @param {string}  stemmedWordToCheck  The stem to check.
 *
 * @returns {Array<string>} The modified forms.
 */
const addFormsWithRemovedLetters = function( morphologyDataNouns, stemmedWordToCheck ) {
	const forms = [];
	const stemChanges = morphologyDataNouns.changeStem;

	for ( const key of Object.keys( stemChanges ) ) {
		const changeCategory = stemChanges[ key ];
		const endingToCheck = changeCategory[ 0 ];

		if ( stemmedWordToCheck.endsWith( endingToCheck ) ) {
			const stemWithoutEnding = stemmedWordToCheck.slice( 0, stemmedWordToCheck.length - endingToCheck.length );
			forms.push( stemWithoutEnding.concat( changeCategory[ 1 ] ) );
		}
	}

	return forms;
};

/**
 * Generates regular verb forms.
 *
 * @param {Object}  morphologyDataNouns The German morphology data for nouns.
 * @param {string}  stemmedWord         The stemmed word for which to create the regular noun forms.
 *
 * @returns {string[]} The created noun forms.
 */
export function generateRegularNounForms( morphologyDataNouns, stemmedWord ) {
	const forms = [];

	// Modify regular suffixes assuming the word is a noun.
	let regularNounSuffixes = morphologyDataNouns.regularSuffixes.slice();
	// Depending on the specific ending of the stem, we can add/remove some suffixes from the list of regulars.
	regularNounSuffixes = modifyListOfRegularSuffixes( morphologyDataNouns, regularNounSuffixes, stemmedWord );

	// Add regular suffixes.
	forms.push( ...regularNounSuffixes.map( suffix => stemmedWord.concat( suffix ) ) );

	/*
     * In some cases, we need make changes to the stem that aren't simply concatenations (e.g. remove n from the stem
     * Ärztinn to obtain Ärztin.
     */
	forms.push( ...addFormsWithRemovedLetters( morphologyDataNouns, stemmedWord ) );

	return forms;
}
