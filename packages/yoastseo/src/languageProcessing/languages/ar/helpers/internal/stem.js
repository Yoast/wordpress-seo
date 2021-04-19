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
 * Tries to match a word with a regex. If matched, modifies the string according to the indicated pattern.
 *
 * @param {string}		word				The word to check.
 * @param {string[]}	regexAndReplacement	The regex to match the word with and what the word should be replaced with if it is matched.
 *
 * @returns {string}	The modified word or the original word if it was not matched.
 */
const matchWithRegexAndReplace = function( word, regexAndReplacement ) {
	return word.replace( new RegExp( regexAndReplacement[ 0 ] ),
		regexAndReplacement[ 1 ] );
};

/**
 * Check if the word is on the list of three-letter roots which had the last weak letter removed (so are now two letters long).
 * If the word is on the list, add back the removed last letter and return the three-letter root.
 * Examples: طر -> طري (word with last weak letter ي (yeh) removed) , حص -> حصا (word with last weak letter ا (alef) removed)
 *
 * @param {string}	word			The two-letter word to check.
 * @param {Object}	morphologyData	The Arabic morphology data.
 *
 * @returns {string|null}	The word with the last weak letter added back or null if the word was not found on a list.
 */
const checkWordsWithRemovedLastLetter = function( word, morphologyData ) {
	const externalStemmer = morphologyData.externalStemmer;
	const characters = externalStemmer.characters;

	if ( externalStemmer.wordsWithLastAlefRemoved.includes( word ) ) {
		return word + characters.alef;
	}
	if ( externalStemmer.wordsWithLastHamzaRemoved.includes( word ) ) {
		return word + characters.alef_hamza_above;
	}
	if ( externalStemmer.wordsWithLastMaksoraRemoved.includes( word ) ) {
		return word + characters.yeh_maksorah;
	}
	if ( externalStemmer.wordsWithLastYehRemoved.includes( word ) ) {
		return word + characters.yeh;
	}
};

/**
 * Check if the word is on the list of three-letter roots which had the first weak letter removed (so are now two letters long).
 * If the word is on the list, add back the removed first letter and return the three-letter root.
 * Examples: مض -> ومض (word with first weak letter و (waw) removed) , سن -> يسن (word with first weak letter ي (yeh) removed)
 *
 * @param {string}	word			The two-letter word to check.
 * @param {Object}	morphologyData	The Arabic morphology data.
 *
 * @returns {string|null}	The word with the first weak letter added back or null if the word was not found on any list.
 */
const checkWordsWithRemovedFirstLetter = function( word, morphologyData ) {
	const externalStemmer = morphologyData.externalStemmer;
	const characters = externalStemmer.characters;

	if ( externalStemmer.wordsWithFirstWawRemoved.includes( word ) ) {
		return characters.waw + word;
	}
	if ( externalStemmer.wordsWithFirstYehRemoved.includes( word ) ) {
		return characters.yeh + word;
	}
};

/**
 * Check if the word is on the list of three-letter roots which had the middle weak letter removed (so are now two letters long).
 * If the word is on the list, add back the removed middle letter and return the three-letter root.
 * Examples: غز -> غوز (word with middle weak letter و (waw) removed), لن -> لين (word with middle weak letter ي (yeh) removed)
 *
 * @param {string}	word			The two-letter word to check.
 * @param {Object}	morphologyData	The Arabic morphology data.
 *
 * @returns {string|null}	The word with the middle weak letter added back or null if the word was not found on a list.
 */
const checkWordsWithRemovedMiddleLetter = function( word, morphologyData ) {
	const externalStemmer = morphologyData.externalStemmer;
	const characters = externalStemmer.characters;

	if ( externalStemmer.wordsWithMiddleWawRemoved.includes( word ) ) {
		return word[ 0 ] + characters.waw + word[ 1 ];
	}
	if ( externalStemmer.wordsWithMiddleYehRemoved.includes( word ) ) {
		return word[ 0 ] + characters.yeh + word[ 1 ];
	}
};


/**
 * Find the root of two-letter words. Two-letter words usually come from three-letter roots for which a letter was deleted
 * as it is a duplicated last letter or a weak letter.
 *
 * @param {string}	word			The two-letter word to process.
 * @param {Object}	morphologyData	The Arabic morphology data.
 *
 * @returns {string}	The three-letter root or the input word if no root was found.
 */
const processTwoLetterWords = function( word, morphologyData ) {
	// Check whether the word is on the list of words with removed duplicate last letter. If it is, add back the removed letter to get the root.
	if ( morphologyData.externalStemmer.wordsWithRemovedDuplicateLetter.includes( word ) ) {
		return word + word.substring( 1 );
	}
	// Check whether the word is on one of the lists of words with removed weak letter or hamza.
	const wordAfterLastLetterCheck = checkWordsWithRemovedLastLetter( word, morphologyData );
	if ( wordAfterLastLetterCheck ) {
		return wordAfterLastLetterCheck;
	}
	const wordAfterFirstLetterCheck = checkWordsWithRemovedFirstLetter( word, morphologyData );
	if ( wordAfterFirstLetterCheck ) {
		return wordAfterFirstLetterCheck;
	}
	const wordAfterMiddleLetterCheck = checkWordsWithRemovedMiddleLetter( word, morphologyData );
	if ( wordAfterMiddleLetterCheck ) {
		return wordAfterMiddleLetterCheck;
	}

	return word;
};

/**
 * Remove the middle/last weak letter or hamza in a three letter word. Find its root by checking the appropriate exception lists
 * (words with middle letter removed or words with last letter removed) and attaching the removed letter back.
 * Example: بدء -> بد -> بدأ (three letter word with (ء) hamza ending,
 * which is found on the list of words with last letter removed after removing the suffix)
 *
 * @param {string}		word					The three-letter word to check.
 * @param {Object}		morphologyData			The Arabic morphology data.
 * @param {string[]}	replacementPattern		The regex to find and remove middle or last weak letter/hamza in three letter words
 * @param {function}	functionToRunToGetRoot	The function that checks lists of words with either middle or last letter removed
 * 												and attaches it back.
 *
 * @returns {string|null}	The root or null if no root was found.
 */
const processThreeLetterWordsWithWeakLetterOrHamza = function( word, morphologyData, replacementPattern, functionToRunToGetRoot ) {
	// Find and remove middle or last weak letter or hamza
	const wordAfterRemovingWeakLetterOrHamza = word.replace( new RegExp( replacementPattern[ 0 ] ),
		replacementPattern[ 1 ] );
	if ( wordAfterRemovingWeakLetterOrHamza !== word ) {
		/*
		 * If the weak letter or hamza was removed, get the root by checking lists of words with middle/last weak letter
		 * or hamza removed and attaching it back.
		 */
		return functionToRunToGetRoot( wordAfterRemovingWeakLetterOrHamza, morphologyData );
	}
};

/**
 * Get the root of three letter words.
 * Examples: ؤكد -> أكد (three letter word with ؤ (waw_hamza) beginning, قدّ -> قدد (three letter word which has a shadda on the second letter)
 *
 * @param {string}	word			The three-letter word to check.
 * @param {Object}	morphologyData	The Arabic morphology data.
 *
 * @returns {string|null}	The root or the original input word (which may already be the root).
 */
const processThreeLetterWords = function( word, morphologyData ) {
	const characters = morphologyData.externalStemmer.characters;

	// If the word exists on the list of three letter roots, return the word.
	if ( morphologyData.externalStemmer.threeLetterRoots.includes( word ) ) {
		return word;
	}
	// If the first letter is ا/ ؤ/ ئ (yeh_hamza/waw_hamza/alef), change it to أ (alef_hamza_above).
	if ( word[ 0 ] === characters.alef || word[ 0 ] === characters.waw_hamza ||
			word[ 0 ] === characters.yeh_hamza ) {
		word = characters.alef_hamza_above + word.slice( 1 );
	}

	// If the last letter is a weak letter or a hamza, check if the word is a root that may get the last weak letter/hamza removed.
	const wordAfterLastWeakLetterOrHamzaCheck = processThreeLetterWordsWithWeakLetterOrHamza( word, morphologyData,
		morphologyData.externalStemmer.regexRemoveLastWeakLetterOrHamza, checkWordsWithRemovedLastLetter );
	if ( wordAfterLastWeakLetterOrHamzaCheck ) {
		return wordAfterLastWeakLetterOrHamzaCheck;
	}

	// If the middle letter is a waw, yeh, alef or a yeh_hamza, check if the word is a root that may get the middle weak letter/hamza removed..
	const wordAfterMiddleWeakLetterOrHamzaCheck = processThreeLetterWordsWithWeakLetterOrHamza( word, morphologyData,
		morphologyData.externalStemmer.regexRemoveMiddleWeakLetterOrHamza, checkWordsWithRemovedMiddleLetter );
	if ( wordAfterMiddleWeakLetterOrHamzaCheck ) {
		return wordAfterMiddleWeakLetterOrHamzaCheck;
	}

	const regexReplaceMiddleLetterWithAlef = morphologyData.externalStemmer.regexReplaceMiddleLetterWithAlef;
	const regexReplaceMiddleLetterWithAlefWithHamza = morphologyData.externalStemmer.regexReplaceMiddleLetterWithAlefWithHamza;

	// If the word has ئ/ؤ (yeh_hamza/waw_hamza) as the second letter and ends in ر/ز/ن (noon/zai/reh), change ئ/ؤ (yeh_hamza/waw_hamza) to ا (alef).
	const wordAfterReplacingMiddleLetterWithAlef = word.replace( new RegExp( regexReplaceMiddleLetterWithAlef[ 0 ] ),
		regexReplaceMiddleLetterWithAlef[ 1 ] );
	if ( wordAfterReplacingMiddleLetterWithAlef === word ) {
		// If the second letter is a ئ/ؤ (yeh_hamza/waw_hamza) and it doesn't end in noon/zai/reh, change ئ/ؤ d to أ (alef_hamza_above).
		word = word.replace( new RegExp( regexReplaceMiddleLetterWithAlefWithHamza[ 0 ] ),
			regexReplaceMiddleLetterWithAlefWithHamza[ 1 ] );
	} else {
		word = wordAfterReplacingMiddleLetterWithAlef;
	}
	// If the last letter is a shadda, remove it and duplicate the last letter.
	const regexRemoveShaddaAndDuplicateLastLetter = morphologyData.externalStemmer.regexRemoveShaddaAndDuplicateLastLetter;
	word = word.replace( new RegExp( regexRemoveShaddaAndDuplicateLastLetter[ 0 ] ),
		regexRemoveShaddaAndDuplicateLastLetter[ 1 ] );

	return word;
};

/**
 * Check whether the word matches the pattern (it is a 6 letter-word, the fourth and sixth letter are the same, and the pattern
 * and the word share two same letters at the same index). If it does, remove the first character and the two last characters and
 * get the root.
 * Example: احولال -> حول (the stem is the 2nd to 4th character)
 *
 * @param {string}	word				The word to check.
 * @param {number}	numberSameLetters	The number of letters the word and the pattern share at the same index.
 * @param {Object}	morphologyData		The Arabic morphology data.
 *
 * @returns {string} The root or the original word if word was not matched by the pattern.
 */
const checkFirstPatternAndGetRoot = function( word, numberSameLetters, morphologyData ) {
	if ( word.length === 6 && word[ 3 ] === word[ 5 ] && numberSameLetters === 2 ) {
		return processThreeLetterWords( word.substring( 1, 4 ), morphologyData );
	}
	return word;
};

/**
 * Checks whether the word matches the pattern (the word shares three characters with the pattern) and get the root if it does.
 * Example: استكتب -> كتب (A word that matches pattern (استفعل))
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
	// If the word length minus three is equal to or less than the number of same letters found in the checkPatterns function.
	if ( word.length - 3 <= numberSameLetters ) {
		let root = "";
		for ( let i = 0; i < word.length; i++ ) {
			if ( pattern[ i ] === characters.feh ||
				pattern[ i ] === characters.aen ||
				pattern[ i ] === characters.lam ) {
				root = root.concat( word[ i ] );
			}
		}

		return processThreeLetterWords( root, morphologyData );
	}
	return word;
};

/**
 * Count the number of letters the word and the pattern to match with share at the same index.
 *
 * @param {string}	word			The word to check.
 * @param {string}	pattern			The pattern to check.
 * @param {Object}	morphologyData	The Arabic morphology data.
 *
 * @returns {number}	The number of shared letters between the word and the pattern at the same index.
 */
const countSharedLettersBetweenWordAndPattern = function( word, pattern, morphologyData ) {
	const characters = morphologyData.externalStemmer.characters;

	let numberSameLetters = 0;
	for ( let i = 0; i < word.length; i++ ) {
		if ( pattern[ i ] === word[ i ] &&
			pattern[ i ] !== characters.feh &&
			pattern[ i ] !== characters.aen &&
			pattern[ i ] !== characters.lam ) {
			numberSameLetters++;
		}
	}
	return numberSameLetters;
};

/**
 * Check if a word matches a specific pattern of letters, and if it does, modify the word to get the root.
 *
 * @param {string}	word			The word to check.
 * @param {Object}	morphologyData	The Arabic morphology data.
 *
 * @returns {Object|null} An object with either the root or the modified word and the information whether the root was found,
 * 						  or null if the word was not modified and the root was not found.
 */
const checkPatterns = function( word, morphologyData ) {
	// If the first letter is an alef_madda, alef_hamza_above, or alef_hamza_below (أ/إ/آ), change it to an alef (ا)
	const wordAfterModification = matchWithRegexAndReplace( word, morphologyData.externalStemmer.regexReplaceFirstHamzaWithAlef );

	// Try and find a pattern that matches the word
	for ( const pattern of morphologyData.externalStemmer.patterns ) {
		if ( pattern.length === wordAfterModification.length ) {
			// Count the number of letters the word and the pattern share at the same index.
			const numberSameLetters = countSharedLettersBetweenWordAndPattern( wordAfterModification, pattern, morphologyData );

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

	// If a pattern was not matched but the word was modified, return the modified word.
	if ( wordAfterModification !== word ) {
		return { word: wordAfterModification, rootFound: false };
	}
};

/**
 * Tries to find the root of two-, three- and four-letter words by checking lists and/or applying modifications to the word.
 *
 * Example: the word أبطر is on the list of four-letter roots.
 *
 * @param {string} 	word			The word to check.
 * @param {Object}	morphologyData	The Arabic morphology data.
 *
 * @returns {string|null} The root or null if the root was not found.
 */
const checkIfWordIsRoot = function( word, morphologyData ) {
	// Check if the word consists of two letters and find its root.
	if ( word.length === 2 ) {
		return processTwoLetterWords( word, morphologyData );
	}
	// Check if the word consists of three letters.
	if ( word.length === 3 ) {
		return processThreeLetterWords( word, morphologyData );
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
			return word.slice( 0, -suffix.length );
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
			return word.substring( prefix.length, word.length );
		}
	}
	return word;
};

/**
 * Searches for a suffix, removes it if found, and tries to find the root of the stemmed word. If the root is not found, the
 * function returns null, with one exception: it is possible that in the checkPatterns function that is ran inside of this one,
 * the word is modified but no root is found. In this case, the function returns the modified word.
 *
 * Example: جمعكم -> جمع (word with suffix كم which is found on the list of three-letter roots after removing the suffix).
 *
 * @param {string}	word			The word to check.
 * @param {Object}	morphologyData	The Arabic morphology data.
 *
 * @returns {Object|null} An object with the root/modified word and information about whether the root was found, or null if
 * 						  the word is not modified and no root is found.
 */
const processWordWithSuffix = function( word, morphologyData ) {
	// Find and remove suffix.
	const wordAfterRemovingSuffix = removeSuffix( word, morphologyData.externalStemmer.suffixes );
	if ( wordAfterRemovingSuffix !== word ) {
		// If suffix was removed, check if the stemmed word is a root.
		const root = checkIfWordIsRoot( wordAfterRemovingSuffix, morphologyData );
		if ( root ) {
			return { word: root, rootFound: true };
		}
		// If no root was found, try to get the root by matching with a pattern.
		const outputAfterCheckingPatterns = checkPatterns( wordAfterRemovingSuffix, morphologyData );
		if ( outputAfterCheckingPatterns ) {
			return outputAfterCheckingPatterns;
		}
	}
};

/**
 * Searches for a prefix (other than the definite article), removes it if found, and tries to find the root of the stemmed
 * word. If the root is not found, the function returns null, with one exception: it is possible that in the checkPatterns
 * function that is ran inside of this one, the word is modified but no root is found. In this case, the function returns
 * the modified word.
 *
 * Example: للزهور -> زهر (word with prefix لل that gets its root by matching with a pattern after removing the prefix).
 *
 * @param {string}	word			The word to check.
 * @param {Object}	morphologyData	The Arabic morphology data.
 *
 * @returns {Object|null}	An object with the root/modified word and information about whether the root was found, or null if
 * 						    the word is not modified and no root is found.
 */
const processWordWithPrefix = function( word, morphologyData ) {
	// Find and remove prefix.
	let wordAfterRemovingPrefix = removePrefix( word, morphologyData.externalStemmer.prefixes );
	if ( wordAfterRemovingPrefix !== word ) {
		// If prefix was removed, check if the stemmed word is a root.
		const root = checkIfWordIsRoot( wordAfterRemovingPrefix, morphologyData );
		if ( root ) {
			return { word: root, rootFound: true };
		}
		// If no root was found, try to get the root by matching with a pattern.
		const outputAfterCheckingPatterns = checkPatterns( wordAfterRemovingPrefix, morphologyData );
		if ( outputAfterCheckingPatterns ) {
			if ( outputAfterCheckingPatterns.rootFound === true ) {
				return outputAfterCheckingPatterns;
			}
			wordAfterRemovingPrefix = outputAfterCheckingPatterns.word;
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
 * still not found, removes affixes and tries to find the root again. If the root is not found, the function returns null,
 * with one exception: it is possible that in the checkPatterns function that is ran inside of this one, the word is modified
 * but no root is found. In this case, the function returns the modified word.
 *
 * @param {string}	word			The word to check.
 * @param {Object}	morphologyData	The Arabic morphology data.
 *
 * @returns {Object|null}	An object with the root/modified word and information about whether the root was found, or null if
 * 						    the word is not modified and no root is found.
 */
const findRoot = function( word, morphologyData ) {
	// Check if the word is a root.
	const root = checkIfWordIsRoot( word, morphologyData );
	if ( root ) {
		return { word: root, rootFound: true };
	}

	// Check if the root can be derived by matching a pattern. إعدجص
	const outputAfterCheckingPatterns = checkPatterns( word, morphologyData );
	let stemmedWord = word;
	if ( outputAfterCheckingPatterns ) {
		if ( outputAfterCheckingPatterns.rootFound === true ) {
			return outputAfterCheckingPatterns;
		}
		// Word: اعدجص
		stemmedWord = outputAfterCheckingPatterns.word;
	}
	// Remove affixes and check if the stemmed word is a root
	const outputAfterProcessingSuffix = processWordWithSuffix( stemmedWord, morphologyData );
	if ( outputAfterProcessingSuffix ) {
		return outputAfterProcessingSuffix;
	}
	const outputAfterRemovingPrefix = processWordWithPrefix( stemmedWord, morphologyData );
	if ( outputAfterRemovingPrefix ) {
		return outputAfterRemovingPrefix;
	}

	if ( stemmedWord !== word ) {
		return { word: stemmedWord, rootFound: false };
	}
};

/**
 * Search for and remove a definite article and try to get the root of the word. If the root was not found, but the word
 * was modified inside the checkPatterns function, returns the modified word. If the definite article was removed and the
 * stemmed word is longer than three letters, but the root was not found, returns the stemmed word. Otherwise, if the root
 * was not found, returns null.
 *
 * Example: الجدولين -> جدول (word with definite article ال and suffix ين ).
 *
 * @param {string}	word			The word to check.
 * @param {Object}	morphologyData	The Arabic morphology data.
 *
 * @returns {Object|null}	An object with the root/modified word and information about whether the root was found, or null if
 * 						    the word is not modified and no root is found.
 */
const processWordWithDefiniteArticle = function( word, morphologyData ) {
	// Search for and remove the definite article.
	const wordAfterRemovingDefiniteArticle = removePrefix( word, morphologyData.externalStemmer.definiteArticles );
	// If a definite article was removed, try to find the root.
	if ( wordAfterRemovingDefiniteArticle !== word ) {
		/**
		 * If definite article was removed, try to find root by checking whether the word is a root, matching with a pattern, and/or
		 * searching for and removing prefixes.
		 */
		const outputAfterTryingToFindRoot = findRoot( wordAfterRemovingDefiniteArticle, morphologyData );
		if ( outputAfterTryingToFindRoot  ) {
			return outputAfterTryingToFindRoot;
		}

		// Return it even if no root was found.
		return { word: wordAfterRemovingDefiniteArticle, rootFound: false };
	}
};

/**
 * Searches for prefix waw (و) and removes it if found, then tries to find the root. If the root is still not found, removes
 * affixes and tries to find the root again. If the root is not found, the function returns null, with one exception: it
 * is possible that in the checkPatterns function that is ran inside of this one, the word is modified but no root is found.
 * In this case, the function returns the modified word.
 *
 * Example: وتمثّل -> مثل (word with prefix waw which matches a pattern after removing the prefix).
 *
 * @param {string}	word			The word to check.
 * @param {Object}	morphologyData	The Arabic morphology data.
 *
 * @returns {Object|null}	An object with the root/modified word and information about whether the root was found, or null if
 * 						    the word is not modified and no root is found.
 */
const processWordWithPrefixWaw = function( word, morphologyData ) {
	let wordAfterRemovingWaw = "";
	if ( word.length > 3 && word.startsWith( morphologyData.externalStemmer.characters.waw ) ) {
		wordAfterRemovingWaw = word.substring( 1 );
		/*
		 * If the prefix waw was removed, try to find the root by checking whether the word is a root, matching with a pattern,
		 * and/or searching for and removing prefixes.
		 */
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

	const root = checkIfWordIsRoot( word, morphologyData );
	if ( root ) {
		return root;
	}
	// If the root still hasn't been found, check if the word matches a pattern and get its root if it does.
	const outputAfterCheckingPatterns = checkPatterns( word, morphologyData );
	if ( outputAfterCheckingPatterns ) {
		// Return the root if it was found in the checkPatterns function
		if ( outputAfterCheckingPatterns.rootFound === true ) {
			return outputAfterCheckingPatterns.word;
		}
		// If the checkPatterns function modified the word but did not find the root, replace the word with the modified word.
		word = outputAfterCheckingPatterns.word;
	}

	// If the root still hasn't been found, remove the definite article and try to find the root.
	const outputAfterProcessingDefiniteArticle = processWordWithDefiniteArticle( word, morphologyData );
	if ( outputAfterProcessingDefiniteArticle ) {
		// Return the root if it was found after removing the definite article.
		if ( outputAfterProcessingDefiniteArticle.rootFound === true ) {
			return outputAfterProcessingDefiniteArticle.word;
		}
		// If the definite article was removed but the root was not found, replace the word with the stemmed word.

		word = outputAfterProcessingDefiniteArticle.word;
	}

	// If the root still hasn't been found, remove the prefix waw and try to find the root.
	const outputAfterProcessingPrefixWaw = processWordWithPrefixWaw( word, morphologyData );
	if ( outputAfterProcessingPrefixWaw ) {
		if ( outputAfterProcessingPrefixWaw.rootFound === true ) {
			return outputAfterProcessingPrefixWaw.word;
		}
		// If the checkPatterns function modified the word but did not find the root, replace the word with the modified word.
		word = outputAfterProcessingPrefixWaw.word;
	}
	// If the root still hasn't been found, remove a suffix and try to find the root.
	const outputAfterProcessingSuffix = processWordWithSuffix( word, morphologyData );
	if ( outputAfterProcessingSuffix ) {
		return outputAfterProcessingSuffix.word;
	}

	// If the root still hasn't been found, remove a prefix and try to find the root.
	const wordAfterProcessingPrefix = processWordWithPrefix( word, morphologyData );
	if ( wordAfterProcessingPrefix ) {
		return wordAfterProcessingPrefix.word;
	}

	return word;
}
