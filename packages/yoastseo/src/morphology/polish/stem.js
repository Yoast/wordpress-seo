const endsIn = function( word, suffix ) {
	if ( word.length < suffix.length ) {
		return false;
	}

	return ( word.slice( -suffix.length ) === suffix );
};

const endsInArr = function( word, suffixes ) {
	const matches = [];
	for ( const i in suffixes ) {
		if ( endsIn( word, suffixes[ i ] ) ) {
			matches.push( suffixes[ i ] );
		}
	}

	const longest = matches.sort( function( a, b ) {
		return b.length - a.length;
	} )[ 0 ];

	if ( longest ) {
		return longest;
	}
	return "";
};

/**
 * Stems Polish words.
 *
 * @param {string} word            The word to stem.
 * @param {number} wordLength      The length of the word.
 * @param {string[]} suffixes      The suffix group.
 * @param {number} suffixLength    The length of the suffix.
 *
 * @returns {string}               The stemmed word.
 */

const stemSuffix = function( word, wordLength, suffixes, suffixLength ) {
	if ( word.length > wordLength ) {
		const suffix = endsInArr( word, suffixes );

		if ( suffix !== "" ) {
			return word.slice( 0, suffixLength );
		}
	}
};

const stemDiminutiveSuffixes = function ( word ) {
	const fiveLetterDiminutiveEndings = ["eczek", "iczek", "iszek", "aszek", "uszek"];
	const fourLetterDiminutiveEndings = ["enek", "ejek", "erek"];
	const twoLetterDiminutiveEndings = ["ek", "ak"];

	const stem = stemSuffix( word, 6, fiveLetterDiminutiveEndings, 5 );
	if (stem) {
		return stem;
	}

	const stem = stemSuffix( word, 6, fourLetterDiminutiveEndings, 2 );
	if (stem) {
		return stem;
	}

	const stem = stemSuffix( word, 4, twoLetterDiminutiveEndings, 2 );
	if (stem) {
		return stem;
	}
};

const stemVerbSuffixes = function ( word ) {
	const threeLetterVerbEndingsOne = [ "bym", "esz", "asz", "cie", "eść", "aść", "łem", "amy", "emy" ];
	const threeLetterVerbEndingsTwo = [ "esz", "asz", "eść", "aść" ];
	const twoLetterVerbEndingsOne = [ "aj" ];
	const twoLetterVerbEndingsTwo = [ "ać", "em", "am", "ał", "ił", "ić", "ąc", "eć" ];

	const stem = stemSuffix( word, 5, threeLetterVerbEndingsOne, 3 );
	if (stem) {
		return stem;
	}

	const stem = stemSuffix( word, 3, threeLetterVerbEndingsTwo, 2 );
	if (stem) {
		return stem;
	}

	const stem = stemSuffix( word, 3, twoLetterVerbEndingsOne, 1 );
	if (stem) {
		return stem;
	}

	const stem = stemSuffix( word, 2, twoLetterVerbEndingsTwo, 2 );
	if (stem) {
		return stem;
	}
};

const stemNounSuffixes = function ( word ) {
	const fiveLetterNounEndings = [ "zacja", "zacją", "zacji" ];
	const fourLetterNounEndingsOne = [ "acja", "acji", "acją", "tach", "anie", "enie", "eniu", "aniu" ];
	const fourLetterNounEndingsTwo = [ "tyka" ];
	const threeLetterNounEndingsOne = [ "ach", "ami", "nia", "niu", "cia", "ciu" ];
	const twoThreeLetterNounEndings = [ "cji", "cja", "cją", "ce", "ta" ];

	const stem = stemSuffix( word, 7, fiveLetterNounEndings, 4 );
	if (stem) {
		return stem;
	}

	const stem = stemSuffix( word, 6, fourLetterNounEndingsOne, 4 );
	if (stem) {
		return stem;
	}

	const stem = stemSuffix( word, 6, fourLetterNounEndingsTwo, 2 );
	if (stem) {
		return stem;
	}

	const stem = stemSuffix( word, 5, threeLetterNounEndingsOne, 3 );
	if (stem) {
		return stem;
	}

	const stem = stemSuffix( word, 5, twoThreeLetterNounEndings, 2 );
	if (stem) {
		return stem;
	}
};
