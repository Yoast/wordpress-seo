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
		return functionToRunToGetRoot( wordAfterRemovingWeakLetterOrHamza, morphologyData );
	}
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
	// If the first letter is an 'Ç', 'Ä'  or 'Æ' then change it to a 'Ã'
	if ( word.charAt( 0 ) === characters.alef || word.charAt( 0 ) === characters.waw_hamza ||
			word.charAt( 0 ) === characters.yeh_hamza ) {
		word = characters.alef_hamza_above + word.slice( 1 );
	}

	// If the last letter is a weak letter or a hamza, remove it and check if the root is a word with the last weak letter or hamza removed.
	const wordAfterLastWeakLetterOrHamzaCheck = processWordsWithWeakLetterOrHamza( word, morphologyData,
		morphologyData.externalStemmer.regexRemoveLastWeakLetterOrHamza, checkWordsWithRemovedLastWeakLetter );
	if ( wordAfterLastWeakLetterOrHamzaCheck ) {
		return wordAfterLastWeakLetterOrHamzaCheck;
	}

	// If the second letter is a waw, yeh, alef or a yeh_hamza, remove it and check if the root is a word with the middle weak letter removed.
	const wordAfterMiddleWeakLetterOrHamzaCheck = processWordsWithWeakLetterOrHamza( word, morphologyData,
		morphologyData.externalStemmer.regexRemoveMiddleWeakLetterOrHamza, checkWordsWithRemovedMiddleWeakLetter );
	if ( wordAfterMiddleWeakLetterOrHamzaCheck ) {
		return wordAfterMiddleWeakLetterOrHamzaCheck;
	}

	// If the second letter has a hamza, and it's not on a alif, then it must be returned to the alif.
	const regexReplaceMiddleLetterWithAlif = morphologyData.externalStemmer.regexReplaceMiddleLetterWithAlif;
	const regexReplaceMiddleLetterWithAlifWithHamza = morphologyData.externalStemmer.regexReplaceMiddleLetterWithAlifWithHamza;
	const wordAfterReplacingMiddleLetterWithAlif = word.replace( new RegExp( regexReplaceMiddleLetterWithAlif[ 0 ] ),
		regexReplaceMiddleLetterWithAlif[ 1 ] );
	if ( wordAfterReplacingMiddleLetterWithAlif === word ) {
		word = word = word.replace( new RegExp( regexReplaceMiddleLetterWithAlifWithHamza[ 0 ] ),
			regexReplaceMiddleLetterWithAlifWithHamza[ 1 ] );
	} else {
		word = wordAfterReplacingMiddleLetterWithAlif;
	}
	// If the last letter is a shadda, remove it and duplicate the last letter.
	const regexRemoveShaddaAndDuplicateLastLetter = morphologyData.externalStemmer.regexRemoveShaddaAndDuplicateLastLetter;
	word = word.replace( new RegExp( regexRemoveShaddaAndDuplicateLastLetter[ 0 ] ),
		regexRemoveShaddaAndDuplicateLastLetter[ 1 ] );

	// Check whether the modified word is a root.
	if ( morphologyData.externalStemmer.threeLetterRoots.includes( word ) ) {
		return word;
	}
};

/**
 * @param {string}		word				The word to check.
 * @param {string[]}	regexAndReplacement	The regex to match the word with and what the word should be replaced with if it is matched.
 *
 * @returns {string}	The modified word or the original word if it was not matched by the regex.
 */
const matchWithRegexAndReplace = function( word, regexAndReplacement ) {
	return word.replace( new RegExp( regexAndReplacement[ 0 ] ),
		regexAndReplacement[ 1 ] );
};

/**
 * Test to see if the word matches the pattern ÇÝÚáÇ. If it does, get remove the first and the two last characters and
 * try to find the root.
 *
 * @param {string}	word				The word to check.
 * @param {number}	numberSameLetters	The number of letters the word and the pattern share at the same index.
 * @param {Object}	morphologyData		The Arabic morphology data.
 *
 * @returns {string} The root or the original word if no root was found.
 */
const checkFirstPatternAndGetRoot = function( word, numberSameLetters, morphologyData ) {
	if ( word.length === 6 && word.charAt( 3 ) === word.charAt( 5 ) && numberSameLetters === 2 ) {
		return processThreeLetterWords( word.substring( 1, 4 ), morphologyData );
	}
	return word;
};

/**
 *
 *
 * @param {string}	word				The word to check.
 * @param {string}	pattern				The pattern to check.
 * @param {number}	numberSameLetters	The number of letters the word and the pattern share at the same index.
 * @param {Object}	morphologyData		The Arabic morphology data.
 *
 * @returns {string} The root or the original word if no root was found.
 */
const checkSecondPatternAndGetRoot = function( word, pattern, numberSameLetters, morphologyData ) {
	const characters = morphologyData.externalStemmer.characters;
	if ( word.length - 3 <= numberSameLetters ) {
		let root = "";
		for ( let i = 0; i < word.length; i++ ) {
			if ( pattern.charAt( i ) === characters.feh ||
				pattern.charAt( i ) === characters.aen ||
				pattern.charAt( i ) === characters.lam ) {
				root = root.concat( word.charAt( i ) );
			}
		}
		if ( root.length === 3 ) {
			return processThreeLetterWords( root, morphologyData );
		}
	}
	return word;
};

/**
 * Check if a word matches a specific pattern of letters, and if it does, modify the word to get the root.
 *
 * @param {string}	word			The word to check.
 * @param {Object}	morphologyData	The Arabic morphology data
 *
 * @returns {Object}				The root or the original word if no root was found.
 */
const checkPatterns = function( word, morphologyData ) {
	const characters = morphologyData.externalStemmer.characters;
	// If the first letter is an alef_madda, alef_hamza_above, or alef_hamza_below (أ/إ/آ), change it to an alef (ا)
	const wordAfterModification = matchWithRegexAndReplace( word, morphologyData.externalStemmer.regexReplaceFirstHamzaWithAlif );

	// Try and find a pattern that matches the word
	for ( const pattern of morphologyData.externalStemmer.patterns ) {
		if ( pattern.length === wordAfterModification.length ) {
			let numberSameLetters = 0;
			for ( let i = 0; i < wordAfterModification.length; i++ ) {
				if ( pattern.charAt( i ) === wordAfterModification.charAt( i ) &&
					pattern.charAt( i ) !== characters.feh &&
					pattern.charAt( i ) !== characters.aen &&
					pattern.charAt( i ) !== characters.lam ) {
					numberSameLetters++;
				}
			}
			const wordAfterCheckingFirstPattern = checkFirstPatternAndGetRoot( wordAfterModification, numberSameLetters, morphologyData );
			if ( wordAfterCheckingFirstPattern !== wordAfterModification ) {
				return { word: wordAfterCheckingFirstPattern, rootFound: true };
			}

			const wordAfterCheckingSecondPattern = checkSecondPatternAndGetRoot( wordAfterModification, pattern, numberSameLetters, morphologyData );
			if ( wordAfterCheckingSecondPattern !== wordAfterModification ) {
				return { word: wordAfterCheckingSecondPattern, rootFound: true };
			}
		}
	}
	if ( wordAfterModification !== word ) {
		return { word: wordAfterModification, rootFound: false };
	}
};

/**
 * Tries to find the root of a word by checking lists and/or applying modifications to the word.
 *
 * @param {string} 	word			The word to check.
 * @param {Object}	morphologyData	The Arabic morphology data.
 *
 * @returns {string} The root or the word if no root was found.
 */
const checkIfWordIsRoot = function( word, morphologyData ) {
	// Check if the word consists of two letters and find its root.
	if ( word.length === 2 ) {
		return processTwoLetterWords( word, morphologyData );
	}
	// Check if the word consists of three letters.
	if ( word.length === 3 ) {
		// Check if it is a root.
		if ( morphologyData.externalStemmer.threeLetterRoots.includes( word ) ) {
			return word;
		}
		// If it is not a root, process it to find its root.
		const wordAfterThreeLetterProcessing = processThreeLetterWords( word, morphologyData );
		if ( wordAfterThreeLetterProcessing ) {
			return wordAfterThreeLetterProcessing;
		}
	}
	// If the word consists of four letters, check if it is on the list of four-letter roots.
	if ( word.length === 4 ) {
		if ( morphologyData.externalStemmer.fourLetterRoots.includes( word ) ) {
			return word;
		}
	}
};

/**
 * Checks whether the word ends in a suffix, and removes it if it does.
 *
 * @param {string}		word		The word to check.
 * @param {string[]}	suffixes	The suffixes to check.
 *
 * @returns {string}	The word with the suffix removed or the input word if no suffix was found.
 */
const removeSuffix = function( word, suffixes ) {
	for ( const suffix of suffixes ) {
		if ( word.endsWith( suffix ) ) {
			return word.slice( 0, suffix.length );
		}
	}
	return word;
};

/**
 * Checks whether the word starts with a prefix, and removes it if it does.
 *
 * @param {string}		word		The word to check.
 * @param {string[]}	prefixes	The prefixes to check.
 *
 * @returns {string}	The word with the prefix removed or the input word if no prefix was found.
 */
const removePrefix = function( word, prefixes ) {
	for ( const prefix of prefixes ) {
		if ( word.startsWith( prefix ) ) {
			return word.slice( -prefix.length );
		}
	}
	return word;
};

/**
 * Searches for a suffix, removes it if found, and tries to find the root of the stemmed word. If no root is found, returns
 * the original word.
 *
 * @param {string}	word			The word to check.
 * @param {Object}	morphologyData	The Arabic morphology data.
 *
 * @returns {Object} The root or the input word if no root was found.
 */
const processWordWithSuffix = function( word, morphologyData ) {
	// Find and remove suffix.
	const wordAfterRemovingSuffix = removeSuffix( word, morphologyData.externalStemmer.suffixes );
	if ( wordAfterRemovingSuffix !== word ) {
		// If suffix was removed, check if the stemmed word is a root.
		const root = checkIfWordIsRoot( wordAfterRemovingSuffix, morphologyData );
		if ( root !== word ) {
			return { word: root, rootFound: true };
		}
		// If no root was found and the stemmed word is longer than 2 characters, try to get the root by matching with a pattern.
		if ( word.length > 2 ) {
			const outputAfterCheckingPatterns = checkPatterns( word, morphologyData );
			if ( outputAfterCheckingPatterns ) {
				return outputAfterCheckingPatterns;
			}
		}
	}
};

/**
 * Searches for a prefix (other than waw or a definite article), removes it if found, and tries to find the root of the stemmed
 * word. If no root is found, returns the original word.
 *
 * @param {string}	word			The word to check.
 * @param {Object}	morphologyData	The Arabic morphology data.
 *
 * @returns {Object}	The root or the input word if no root was found.
 */
const processWordWithPrefix = function( word, morphologyData ) {
	// Find and remove prefix.
	let wordAfterRemovingPrefix = removePrefix( word, morphologyData.externalStemmer.prefixes );
	if ( wordAfterRemovingPrefix !== word ) {
		// If prefix was removed, check if the stemmed word is a root.
		const root = checkIfWordIsRoot( wordAfterRemovingPrefix, morphologyData );
		if ( root !== wordAfterRemovingPrefix ) {
			return { word: root, rootFound: true };
		}
		// If no root was found and the stemmed word is longer than 2 characters, try to get the root by matching with a pattern.
		if ( wordAfterRemovingPrefix.length > 2 ) {
			const outputAfterCheckingPatterns = checkPatterns( wordAfterRemovingPrefix, morphologyData );
			if ( outputAfterCheckingPatterns ) {
				if ( outputAfterCheckingPatterns.rootFound === true ) {
					return outputAfterCheckingPatterns;
				} wordAfterRemovingPrefix = outputAfterCheckingPatterns.word;
			}
		}
		// If the root was still not found, try to find and remove suffixes and find the root again.
		const outputAfterCheckingForSuffixes = processWordWithSuffix( wordAfterRemovingPrefix, morphologyData );
		if ( outputAfterCheckingForSuffixes ) {
			return outputAfterCheckingForSuffixes;
		}
	}
};

/**
 * Checks if the word is a root. If root is not found, checks whether the root can be derived using a pattern. If the root is
 * still not found, removes affixes and tries to find the root again.
 *
 * @param {string}	word			The word to check.
 * @param {Object}	morphologyData	The Arabic morphology data.
 * @returns {Object}	The root of the original word if no root was found.
 */
const findRoot = function( word, morphologyData ) {
	// Check if the word is a root.
	const root = checkIfWordIsRoot( word, morphologyData );
	if ( root ) {
		return { word: root, rootFound: true };
	} if ( word.length > 2 ) {
		// Check if the root can be derived by matching a pattern.
		const outputAfterCheckingPatterns = checkPatterns( word, morphologyData );
		if ( outputAfterCheckingPatterns ) {
			if ( outputAfterCheckingPatterns.rootFound === true ) {
				return outputAfterCheckingPatterns;
			} word = outputAfterCheckingPatterns.word;
		}
		// Remove affixes and check if the stemmed word is a root
	} const wordAfterRemovingSuffix = processWordWithSuffix( word, morphologyData );
	if ( wordAfterRemovingSuffix ) {
		return { word: wordAfterRemovingSuffix, rootFound: true };
	} const outputAfterRemovingPrefix = processWordWithPrefix( word, morphologyData );
	if ( outputAfterRemovingPrefix ) {
		return outputAfterRemovingPrefix;
	}
};

/**
 * Search for and remove a definite article, and try to get the root of the word.
 *
 * @param {string}	word			The word to check.
 * @param {Object}	morphologyData	The Arabic morphology data.
 *
 * @returns {Object}		The root, or the original word and the word after searching and removing a potential definite article.
 */
const processWordWithDefiniteArticle = function( word, morphologyData ) {
	// Search for and remove the definite article.
	let wordAfterRemovingDefiniteArticle = removePrefix( word, morphologyData.externalStemmer.definiteArticles );
	// If a definite article was removed, try to find the root.
	if ( wordAfterRemovingDefiniteArticle !== word ) {
		const outputAfterTryingToFindRoot = findRoot( wordAfterRemovingDefiniteArticle, morphologyData );
		if ( outputAfterTryingToFindRoot  ) {
			if ( outputAfterTryingToFindRoot.rootFound === true ) {
				return outputAfterTryingToFindRoot;
			} wordAfterRemovingDefiniteArticle = outputAfterTryingToFindRoot.word;
		}
		if ( wordAfterRemovingDefiniteArticle > 3 ) {
			return { word: wordAfterRemovingDefiniteArticle, rootFound: false };
		}
	}
};

/**
 * Searches for prefix waw and removes it if found, then tries to find the root.
 *
 * @param {string}	word			The word to check.
 * @param {Object}	morphologyData	The Arabic morphology data.
 *
 * @returns {string}	The root or the input word if no root was found.
 */
const processWordWithPrefixWaw = function( word, morphologyData ) {
	let wordAfterRemovingWaw = "";
	if ( word.length > 3 && word.startsWith( morphologyData.externalStemmer.characters.waw ) ) {
		wordAfterRemovingWaw = word.substring( 1 );
	}
	// If the prefix waw was removed, try to find the root.
	if ( wordAfterRemovingWaw !== word ) {
		const outputAfterTryingToFindRoot = findRoot( wordAfterRemovingWaw, morphologyData );
		if ( outputAfterTryingToFindRoot ) {
			return outputAfterTryingToFindRoot;
		}
	}
};

/**
 * Stems Arabic words.
 *
 * @param {string}	word			The word to stem.
 * @param {Object}	morphologyData	The Arabic morphology data.
 *
 * @returns {string}	The stemmed word.
 */
export default function stem( word, morphologyData ) {
	// Remove diacritics that serve as phonetic guides and are not usually used in regular writing.
	const regexRemovingDiacritics = morphologyData.externalStemmer.regexRemovingDiacritics;
	word.replace( new RegExp( regexRemovingDiacritics ), "" );

	// Look for the root of the word.
	const root = checkIfWordIsRoot( word, morphologyData );
	if ( root ) {
		return root;
	}
	// If the root still hasn't been found, check if the word matches a pattern and get its root if it does.
	const outputAfterCheckingPatterns = checkPatterns( word, morphologyData );
	if ( outputAfterCheckingPatterns ) {
		if ( outputAfterCheckingPatterns.rootFound === true ) {
			return outputAfterCheckingPatterns.word;
		} word = outputAfterCheckingPatterns.word;
	}

	// If the root still hasn't been found, remove the definite article and try to find the root.
	const outputAfterProcessingDefiniteArticle = processWordWithDefiniteArticle( word, morphologyData );
	if ( outputAfterProcessingDefiniteArticle ) {
		if ( outputAfterProcessingDefiniteArticle.rootFound === true ) {
			return outputAfterProcessingDefiniteArticle.word;
		} word = outputAfterCheckingPatterns.word;
	}

	// If the root still hasn't been found, remove the prefix waw and try to find the root.
	const outputAfterProcessingPrefixWaw = processWordWithPrefixWaw( word, morphologyData );
	if ( outputAfterProcessingPrefixWaw ) {
		if ( outputAfterProcessingPrefixWaw.rootFound === true ) {
			return outputAfterProcessingPrefixWaw.word;
		} word = outputAfterProcessingPrefixWaw.word;
	}

	// If the root still hasn't been found, remove a suffix and try to find the root.
	const outputAfterProcessingSuffix = processWordWithSuffix( word, morphologyData );
	if ( outputAfterProcessingSuffix ) {
		if ( outputAfterProcessingSuffix.rootFound === true ) {
			return outputAfterProcessingSuffix.word;
		} word = outputAfterProcessingSuffix.word;
	}

	// If the root still hasn't been found, remove a prefix and try to find the root.
	const wordAfterProcessingPrefix = processWordWithPrefix( word, morphologyData );
	if ( wordAfterProcessingPrefix ) {
		return wordAfterProcessingPrefix.word;
	}

	return word;
}
