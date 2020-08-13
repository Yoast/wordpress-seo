/**
 *
 * @param word
 * @param morphologyData
 * @returns {*}
 */
const checkWordsWithRemovedLastWeakLetter = function( word, morphologyData ) {
	const externalStemmer = morphologyData.externalStemmer;
	const characters = externalStemmer.characters;

	if ( externalStemmer.wordsWithLastAlifRemoved.includes( word ) ) {
		return word + characters.alef;
	}
	if ( externalStemmer.wordsWithLastHamzaRemoved.includes( word ) ) {
		return word + characters.alef_hamza_above;
	}
	if ( externalStemmer.wordsWithLastMaksouraRemoved.includes( word ) ) {
		return word + characters.yeh_maksorah;
	}
	if ( externalStemmer.wordsWithLastYahRemoved.includes( word ) ) {
		return word + characters.yeh;
	}
	return word;
};

/**
 *
 * @param word
 * @param morphologyData
 * @returns {*}
 */
const checkWordsWithRemovedFirstWeakLetter = function( word, morphologyData ) {
	const externalStemmer = morphologyData.externalStemmer;
	const characters = externalStemmer.characters;

	if ( externalStemmer.wordsWithFirstWawRemoved.includes( word ) ) {
		return characters.waw + word;
	}
	if ( externalStemmer.wordsWithFirstYahRemoved.includes( word ) ) {
		return characters.yeh + word;
	}
	return word;
};

/**
 *
 * @param word
 * @param morphologyData
 * @returns {string|*}
 */
const checkWordsWithRemovedMiddleWeakLetter = function( word, morphologyData ) {
	const externalStemmer = morphologyData.externalStemmer;
	const characters = externalStemmer.characters;

	if ( externalStemmer.wordsWithMiddleWawRemoved.includes( word ) ) {
		return word.charAt( 0 ) + ( characters.waw + word.substring( 1 ) );
	}
	if ( externalStemmer.wordsWithMiddleYahRemoved.includes( word ) ) {
		return word.charAt( 0 ) + ( characters.yeh + word.substring( 1 ) );
	}
	return word;
};


/**
 *
 * @param word
 * @param morphologyData
 */
const processTwoLetters = function( word, morphologyData ) {
	// If the input consists of two letters, then this could be either
	// - because it is a root consisting of two letters (though I can't think of any!)
	// - because a letter was deleted as it is duplicated or a weak middle or last letter.
	if ( morphologyData.externalStemmer.wordsWithRemovedDuplicateLetter.includes( word ) ) {
		return word + word.substring( 1 );
	}

	const wordAfterLastWeakLetterCheck = checkWordsWithRemovedLastWeakLetter( word, morphologyData );
	if ( wordAfterLastWeakLetterCheck !== word ) {
		return wordAfterLastWeakLetterCheck;
	}
	const wordAfterFirstWeakLetterCheck = checkWordsWithRemovedFirstWeakLetter( word, morphologyData );
	if ( wordAfterFirstWeakLetterCheck !== word ) {
		return wordAfterFirstWeakLetterCheck;
	}
	const wordAfterMiddleWeakLetterCheck = checkWordsWithRemovedMiddleWeakLetter( word, morphologyData );
	if ( wordAfterMiddleWeakLetterCheck !== word ) {
		return wordAfterMiddleWeakLetterCheck;
	}

	return word;
};

/**
 *
 * @param word
 * @param morphologyData
 */
const processThreeLetters = function( word, morphologyData ) {
	if ( morphologyData.externalStemmer.threeLetterRoots.contains( word ) ) {

	}


	const characters = morphologyData.externalStemmer.characters;
	// If the first letter is an 'Ç', 'Ä'  or 'Æ'
	// Then change it to a 'Ã'
	if ( word.charAt( 0 ) === characters.alef || word.charAt( 0 ) === characters.waw_hamza ||
			word.charAt( 0 ) === characters.yeh_hamza ) {
		word = characters.alef_hamza_above + word.slice( 1 );
	}

	// If the last letter is a weak letter or a hamza, remove it and check if the root is a word with the last weak letter or hamza removed.
	const regexRemoveLastWeakLetterOrHamza = morphologyData.externalStemmer.regexRemoveLastWeakLetterOrHamza;
	const wordAfterRemovingLastWeakLetterOrHamza = word.replace( new RegExp( regexRemoveLastWeakLetterOrHamza[ 0 ] ),
		regexRemoveLastWeakLetterOrHamza[ 1 ] );
	if ( wordAfterRemovingLastWeakLetterOrHamza !== word ) {
		const wordAfterLastWeakLetterCheck = checkWordsWithRemovedLastWeakLetter( wordAfterRemovingLastWeakLetterOrHamza, morphologyData );
		if ( wordAfterLastWeakLetterCheck !== word ) {
			return wordAfterLastWeakLetterCheck;
		}
	}
	// If the second letter is a waw, yeh, alef or a hamza, remove it and check if the root is a word with the middle weak letter removed.
	const regexRemoveMiddleWeakLetterOrHamza = morphologyData.externalStemmer.regexRemoveMiddleWeakLetterOrHamza;
	const wordAfterRemovingMiddleWeakLetterOrHamza = word.replace( new RegExp( regexRemoveMiddleWeakLetterOrHamza[ 0 ] ),
		regexRemoveMiddleWeakLetterOrHamza[ 1 ] );
	if ( wordAfterRemovingMiddleWeakLetterOrHamza !== word ) {
		const wordAfterMiddleWeakLetterCheck = checkWordsWithRemovedMiddleWeakLetter( wordAfterRemovingMiddleWeakLetterOrHamza, morphologyData );
		if ( wordAfterMiddleWeakLetterCheck !== word ) {
			return wordAfterMiddleWeakLetterCheck;
		}
	}
	// If the second letter has a hamza, and it's not on a alif, then it must be returned to the alif.
	const regexReplaceMiddleLetterWithAlif = morphologyData.externalStemmer.regexReplaceMiddleLetterWithAlif;
	const wordAfterReplacingMiddleLetterWithAlif = word.replace( new RegExp( regexReplaceMiddleLetterWithAlif[ 0 ] ),
		regexReplaceMiddleLetterWithAlif[ 1 ] );
	if ( wordAfterReplacingMiddleLetterWithAlif === word ) {
		const regexReplaceMiddleLetterWithAlifWithHamza = morphologyData.externalStemmer.regexReplaceMiddleLetterWithAlifWithHamza;
		word = word.replace( new RegExp( regexReplaceMiddleLetterWithAlifWithHamza[ 0 ] ),
			regexReplaceMiddleLetterWithAlifWithHamza[ 1 ] );
	} word = wordAfterReplacingMiddleLetterWithAlif;

	// If the last letter is a shadda, remove it and duplicate the last letter.
	if ( word.endsWith( characters.shadda ) ) {
		root = input.substring(0, 1);
		root = root + input.substring(1, 2);
	}

	// if word is a root, then flags.rootFound is true
	if (root.length() == 0) {
		if (tri_roots.contains(input)) {
			flags.rootFound = true;
			return input;
		}
	}
	// check for the root that we just derived
	else if (tri_roots.contains(root)) {
		flags.rootFound = true;
		return root;
	}

	return input;
};

/**
 * Stems Arabic words.
 * @param word
 * @param morphologyData
 * @returns {*}
 */
export default function stem( word, morphologyData ) {
	// Remove diacritics that serve as phonetic guides and are not usually used in regular writing.
	const regexRemovingDiacritics = morphologyData.externalStemmer.regexRemovingDiacritics;
	word.replace( new RegExp( regexRemovingDiacritics ), "" );

	// Check if the word consists of two letters
	// And find its root
	if ( word.length === 2 ) {
		const wordAfterTwoLetterProcessing = processTwoLetters( word, morphologyData );
		if ( wordAfterTwoLetterProcessing !== word ) {
			return wordAfterTwoLetterProcessing;
		}
	}

	if ( word.length === 3 ) {
		const wordAfterThreeLetterProcessing = processThreeLetters( word, morphologyData );
		if ( wordAfterThreeLetterProcessing !== word ) {
			return wordAfterThreeLetterProcessing;
		}
	}

	return word;
}
