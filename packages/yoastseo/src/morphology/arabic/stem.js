/**
 * Copyright (c) 2015 Mouaffak A. Sarhan
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * Check if the word is on the list of words which had the last weak letter removed. If it is, add back the
 * removed last letter and return the root.
 *
 * @param {string}	word			The two-letter word to check.
 * @param {Object}	morphologyData	The Arabic morphology data.
 *
 * @returns {string}	The word with the last weak letter added back or the original word.
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
 * Check if the word is on the list of words which had the first weak letter removed. If it is, add back the
 * removed weak letter and return the root.
 *
 * @param {string}	word			The two-letter word to check.
 * @param {Object}	morphologyData	The Arabic morphology data.
 *
 * @returns {string}	The word with the first weak letter added back or the original word.
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
 * Check if the word is on the list of words which had the middle weak letter removed. If it is, add back the
 * removed weak letter and return the root.
 *
 * @param {string}	word			The two-letter word to check.
 * @param {Object}	morphologyData	The Arabic morphology data.
 *
 * @returns {string}	The word with the middle weak letter added back or the original word.
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
 * Find the root of two-letter words.
 *
 * @param {string}	word			The two-letter word to process.
 * @param {Object}	morphologyData	The Arabic morphology data.
 *
 * @returns {string}	The stemmed word.
 */
const processTwoLetterWords = function( word, morphologyData ) {
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
 * Remove the middle or last weak letter or hamza in a three letter word, and find its root by checking an exception list of
 * roots with the middle or last weak letter/hamza removed.
 *
 * @param {string}		word					The three-letter word to check.
 * @param {Object}		morphologyData			The Arabic morphology data.
 * @param {string[]}	replacementPattern		The regex to match the word with and the modification that should be done to the string.
 * @param {function}	functionToRunToGetRoot	The function to run to get the root of the modified word.
 *
 * @returns {string}	The stemmed word.
 */
const processWordsWithWeakLetterOrHamza = function( word, morphologyData, replacementPattern, functionToRunToGetRoot ) {
	const wordAfterRemovingWeakLetterOrHamza = word.replace( new RegExp( replacementPattern[ 0 ] ),
		replacementPattern[ 1 ] );
	if ( wordAfterRemovingWeakLetterOrHamza !== word ) {
		word = functionToRunToGetRoot( wordAfterRemovingWeakLetterOrHamza, morphologyData );
	}
	return word;
};

/**
 * Get the root/stem of three letter words.
 *
 * @param {string}	word			The three-letter word to check.
 * @param {Object}	morphologyData	The Arabic morphology data.
 *
 * @returns {string}	The stemmed word.
 */
const processThreeLetterWords = function( word, morphologyData ) {
	const characters = morphologyData.externalStemmer.characters;

	if ( morphologyData.externalStemmer.threeLetterRoots.includes( word ) ) {
		return word;
	}
	// If the first letter is an 'Ç', 'Ä'  or 'Æ'
	// Then change it to a 'Ã'
	if ( word.charAt( 0 ) === characters.alef || word.charAt( 0 ) === characters.waw_hamza ||
			word.charAt( 0 ) === characters.yeh_hamza ) {
		word = characters.alef_hamza_above + word.slice( 1 );
	}

	// If the last letter is a weak letter or a hamza, remove it and check if the root is a word with the last weak letter or hamza removed.
	const wordAfterLastWeakLetterOrHamzaCheck = processWordsWithWeakLetterOrHamza( word, morphologyData,
		morphologyData.externalStemmer.regexRemoveLastWeakLetterOrHamza, checkWordsWithRemovedLastWeakLetter );
	if ( wordAfterLastWeakLetterOrHamzaCheck !== word ) {
		return wordAfterLastWeakLetterOrHamzaCheck;
	}

	// If the second letter is a waw, yeh, alef or a yeh_hamza, remove it and check if the root is a word with the middle weak letter removed.
	const wordAfterMiddleWeakLetterOrHamzaCheck = processWordsWithWeakLetterOrHamza( word, morphologyData,
		morphologyData.externalStemmer.regexRemoveMiddleWeakLetterOrHamza, checkWordsWithRemovedMiddleWeakLetter );
	if ( wordAfterMiddleWeakLetterOrHamzaCheck !== word ) {
		return wordAfterMiddleWeakLetterOrHamzaCheck;
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
	const regexRemoveShaddaAndDuplicateLastLetter = morphologyData.externalStemmer.regexRemoveShaddaAndDuplicateLastLetter;
	word = word.replace( new RegExp( regexRemoveShaddaAndDuplicateLastLetter[ 0 ] ),
		regexRemoveShaddaAndDuplicateLastLetter[ 1 ] );

	// Check whether the modified word is a root.
	if ( morphologyData.externalStemmer.threeLetterRoots.includes( word ) ) {
		return word;
	}

	return word;
};

/**
 * Stems Arabic words.
 * @param {string}	word			The word to stem.
 * @param {Object}	morphologyData	The Arabic morphology data.
 *
 * @returns {string}	The stemmed word.
 */
export default function stem( word, morphologyData ) {
	// Remove diacritics that serve as phonetic guides and are not usually used in regular writing.
	const regexRemovingDiacritics = morphologyData.externalStemmer.regexRemovingDiacritics;
	word.replace( new RegExp( regexRemovingDiacritics ), "" );

	// Check if the word consists of two letters and find its root.
	if ( word.length === 2 ) {
		const wordAfterTwoLetterProcessing = processTwoLetterWords( word, morphologyData );
		if ( wordAfterTwoLetterProcessing !== word ) {
			return wordAfterTwoLetterProcessing;
		}
	}

	// Check if the word consists of three letters.
	if ( word.length === 3 ) {
		// Check if it is a root.
		if ( morphologyData.externalStemmer.threeLetterRoots.includes( word ) ) {
			return word;
		}
		// If it is not a root, process it to find its root.
		const wordAfterThreeLetterProcessing = processThreeLetterWords( word, morphologyData );
		if ( wordAfterThreeLetterProcessing !== word ) {
			return wordAfterThreeLetterProcessing;
		}
	}

	return word;
}
