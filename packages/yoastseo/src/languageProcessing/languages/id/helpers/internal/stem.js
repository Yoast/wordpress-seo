import { languageProcessing } from "yoastseo";
const { flattenSortLength, buildFormRule, createRulesFromArrays } = languageProcessing;

import { calculateTotalNumberOfSyllables, removeEnding, checkBeginningsList } from "./stemHelpers";

/**
 * MIT License
 *
 * Adapted from: Copyright (c) 2013 Adinda Praditya
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 * and associated documentation files (the \"Software\"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish,  distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND,  EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE."
 */

/**
 * Checks if a single syllable word has one of the suffixes/suffix combination.
 *
 * @param {string} word         The word to check.
 * @param {Array} suffixesArray The array of suffixes
 * @returns {boolean}   Whether the word ends in one of the suffixes or not.
 */
const checkSingleSyllableWordSuffix = function( word, suffixesArray ) {
	for ( const suffix of suffixesArray ) {
		if ( word.match( suffix ) ) {
			return true;
		}
	}
};

/**
 * Stems the prefix of the single syllable words, i.e. di-/penge-/menge-
 *
 * @param {string}	word			The word to check.
 * @param {Object}	morphologyData	The Indonesian morphology data file.
 *
 * @returns {string} The stemmed word.
 */
const stemSingleSyllableWordsPrefixes = function( word, morphologyData ) {
	// If the word gets prefix di-, stem the prefix here. E.g. dicekkanlah -> cekkanlah, dibomi -> bomi
	if ( word.startsWith( "di" ) && checkBeginningsList( word, 2, morphologyData.stemming.singleSyllableWords ) ) {
		return word.substring( 2, word.length );
	}
	/*
	 * If the word gets prefix menge-/penge- and is followed by one of the words in the list, stem the prefix here.
	 * E.g. pengeboman -> boman
	 */
	if ( /^[mp]enge/i.test( word ) && checkBeginningsList( word, 5, morphologyData.stemming.singleSyllableWords ) ) {
		return word.substring( 5, word.length );
	}
	return word;
};

/**
 * Stems Indonesian single syllable words. This function concerns single syllable words
 * with this possible word format [di/penge/menge] + single syllable word + [kan/an/i] + [ku/mu/nya] + [kah/lah/pun], with [] being optional.
 * E.g. dipel -> pel, dipelkan -> pel, dipelkanlah -> pel, pelkan -> pel, pelmulah -> pel, pengeboman -> bom, mengesahkan -> sah
 *
 *
 * @param {string}	word			The word to check.
 * @param {Object}	morphologyData	The Indonesian morphology data file.
 *
 * @returns {string} The stemmed word.
 */
const stemSingleSyllableWords = function( word, morphologyData ) {
	const singleSyllableWords = morphologyData.stemming.singleSyllableWords;
	const suffixCombination = morphologyData.stemming.singleSyllableWordsSuffixes;
	const inputWord = word;
	// If the word starts with prefix di-/penge-/menge-, stem the prefix here. E.g. pengeboman -> boman, dipelkan -> pelkan
	word = stemSingleSyllableWordsPrefixes( word, morphologyData );

	// Check if a word starts with one of the words in the list, has maximum 3 syllables, and ends in one of the single syllable suffixes
	if ( singleSyllableWords.some( shortWord => word.startsWith( shortWord ) ) && calculateTotalNumberOfSyllables( word ) <= 3 &&
		checkSingleSyllableWordSuffix( word, suffixCombination ) ) {
		// If the word gets a particle suffix, stem the particle. E.g. cekkanlah -> cekkan, pelkan -> pel, vasmulah -> vasmu
		word = removeEnding( word, morphologyData.stemming.regexRules.removeParticle,
			morphologyData.stemming.doNotStemWords.doNotStemParticle, morphologyData );

		// If the word gets a possessive pronoun suffix, stem the possessive pronoun. E.g. vasmu -> vas
		word = removeEnding( word, morphologyData.stemming.regexRules.removePronoun,
			morphologyData.stemming.doNotStemWords.doNotStemPronounSuffix, morphologyData );

		// If the word ends in -kan/-an/-i suffix, stem the suffix. E.g. cekkan -> cek, bomi -> bom
		const wordWithoutDerivationalSuffix = removeEnding( word, morphologyData.stemming.regexRules.removeSuffixes,
			morphologyData.stemming.doNotStemWords.doNotStemSuffix, morphologyData );

		if ( singleSyllableWords.includes( wordWithoutDerivationalSuffix ) ) {
			word = wordWithoutDerivationalSuffix;
		}
	}
	/*
	 * We only want to stem single syllable words here.
	 * Thus, if the output word has more than one syllable, we don't stem the input word at all.
	 */
	if ( calculateTotalNumberOfSyllables( word ) > 1 || word.length === 1 ) {
		word = inputWord;
	}
	return word;
};

/**
 * Tries stemming prefixes ke- and ter-. Ke- is always stemmed, and ter- only if it is a prefix and not part of the stem.
 * Also if the stem of the word begins with r-, only te- is stemmed, not ter-.
 *
 * @param {Object}	morphologyData	The Indonesian morphology data file.
 * @param {string}	word			The word to check.
 *
 * @returns {string|null}	The stem or null if the word did not start with ter/keter.
 */
const tryStemmingKeAndTer = function( morphologyData, word ) {
	const terException = morphologyData.stemming.doNotStemWords.doNotStemPrefix.doNotStemFirstOrderPrefix.doNotStemTer;

	// If prefix -ter is preceded by prefix -ke, remove it first.
	if ( word.startsWith( "keter" ) ) {
		word = word.substring( 2, word.length );
	}
	if ( word.startsWith( "ter" ) ) {
		// If word is on an exception list of words where -ter should not be stemmed, do not stem -ter and return the word.
		if ( terException.some( wordWithTer => word.startsWith( wordWithTer ) ) )  {
			return word;
		}
		// If word (without prefixes) is on the list of words beginning with -r, remove only -te instead of -ter.
		if ( checkBeginningsList( word, 3, morphologyData.stemming.beginningModification.rBeginning ) ) {
			return word.replace( /^ter/i, "r" );
		}
		// Otherwise, remove -ter.
		return word.substring( 3, word.length );
	}
};
/**
 * Checks whether a word has a first order prefix and whether it is on an exception list of words which require a stem mofification
 * after removing the prefix. Returns the stem if the prefix was found and the word was matched on an exception list.
 *
 *
 * @param {string}	word			The word to check.
 * @param {Object}	morphologyData	The Indonesian morphology data file.
 *
 * @returns {string|null}	The stem or null if a prefix was not found, or was found but the word was not on the exception list.
 */
const checkFirstOrderPrefixExceptions = function( word, morphologyData ) {
	const beginningModification = morphologyData.stemming.beginningModification;

	// If a word starts with "men" or "pen" and is present in the nBeginning exception list, the prefix should be replaced with "n".
	if ( /^[mp]en/i.test( word ) ) {
		if ( checkBeginningsList( word, 3, beginningModification.nBeginning ) ) {
			return word.replace( /^[mp]en/i, "n" );
		}
	}
	if ( /^[mp]eng/i.test( word ) && checkBeginningsList( word, 4, beginningModification.kBeginning ) ) {
		return word.replace( /^[mp]eng/i, "k" );
	}

	if ( /^[mp]em/i.test( word ) ) {
		if ( checkBeginningsList( word, 3, beginningModification.pBeginning ) ) {
			return word.replace( /^(mem|pem)/i, "p" );
		} else if ( checkBeginningsList( word, 3, beginningModification.mBeginning ) ) {
			return word.replace( /^(mem|pem)/i, "m" );
		}
	}
	// Stem prefix ke- if found. Stem te(r)- unless the word was found on the exception list of words with stem beginning in -ter.
	const wordAfterKeTerCheck = tryStemmingKeAndTer( morphologyData, word );
	if ( wordAfterKeTerCheck ) {
		return wordAfterKeTerCheck;
	}
};

/**
 * Stems the first-order prefix of a word based on regexRules. If the word is found in an exception list, implements a stem modification.
 *
 * @param {string} word           The word to stem.
 * @param {Object} morphologyData The object that contains regex-based rules and exception lists for Indonesian stemming.
 *
 * @returns {string} The stemmed word.
 */
const removeFirstOrderPrefix = function( word, morphologyData ) {
	// Checks whether the word has a first order prefix and requires a stem modification.
	const firstOrderPrefixException = checkFirstOrderPrefixExceptions( word, morphologyData );

	if ( firstOrderPrefixException ) {
		return firstOrderPrefixException;
	}
	const regex = createRulesFromArrays( morphologyData.stemming.regexRules.removeFirstOrderPrefixes );
	const withRemovedFirstOrderPrefix = buildFormRule( word, regex );

	return withRemovedFirstOrderPrefix || word;
};

/**
 * Stems the second-order prefix of a word based on regexRules. If the word is found in an exception list, implements a stem modification.
 *
 * @param {string} word           The word to stem.
 * @param {Object} morphologyData The object that contains regex-based rules and exception lists for Indonesian stemming.
 *
 * @returns {string} The stemmed word.
 */
const removeSecondOrderPrefix = function( word, morphologyData ) {
	// If a word starts with "ber" or "per" and is present in the rBeginning exception list, the prefix should be replaced with "r".
	if ( ( word.startsWith( "ber" ) || word.startsWith( "per" ) ) &&
		checkBeginningsList( word, 3, morphologyData.stemming.beginningModification.rBeginning ) ) {
		return word.replace( /^(ber|per)/i, "r" );
	}
	// If a word starts with a first order prefix followed by peng- and is in the kBeginning exception list, then peng- should be replaced with k.
	if ( /^peng/i.test( word ) && checkBeginningsList( word, 4, morphologyData.stemming.beginningModification.kBeginning ) ) {
		return word.replace( /^peng/i, "k" );
	}
	const regex = createRulesFromArrays( morphologyData.stemming.regexRules.removeSecondOrderPrefixes );
	const withRemovedSecondOrderPrefix = buildFormRule( word, regex );

	return withRemovedSecondOrderPrefix || word;
};

/**
 * Stems derivational affixes of Indonesian words.
 *
 * @param {string} word           The word to stem.
 * @param {Object} morphologyData The object that contains regex-based rules and exception lists for Indonesian stemming.
 *
 * @returns {string} The stemmed word.
 */
const stemDerivational = function( word, morphologyData ) {
	let wordLength = word.length;
	const removeSuffixRules = morphologyData.stemming.regexRules.removeSuffixes;
	const removeSuffixExceptions = morphologyData.stemming.doNotStemWords.doNotStemSuffix;
	const doNotStemFirstOrderPrefix = flattenSortLength( morphologyData.stemming.doNotStemWords.doNotStemPrefix.doNotStemFirstOrderPrefix );
	const doNotStemSecondOrderPrefix = flattenSortLength( morphologyData.stemming.doNotStemWords.doNotStemPrefix.doNotStemSecondOrderPrefix );

	// If a word is in the list of words with a beginning that looks like a valid suffix, do not stem the suffix
	if ( ! doNotStemFirstOrderPrefix.some( wordWithPrefixLookAlike => word.startsWith( wordWithPrefixLookAlike ) ) ) {
		/*
		 * If the word has more than 2 syllables and starts with one of first order prefixes (i.e. meng-, meny-, men-, mem-, me-,
		 * peng-, peny-, pen-, pem-, di-, ter-, ke- ), the prefix will be stemmed here. e.g. penyebaran -> sebaran, diperlebarkan -> perlebarkan
		 */
		word = removeFirstOrderPrefix( word, morphologyData );
	}

	if ( wordLength === word.length ) {
		if ( ! doNotStemSecondOrderPrefix.some( wordWithPrefixLookAlike => word.startsWith( wordWithPrefixLookAlike ) ) ) {
			/*
			 * If the word does not start with one of the first order prefixes but starts with one of the second order prefixes,
			 * the prefix will be stemmed here, e.g., peranakan -> anakan
			 */
			word = removeSecondOrderPrefix( word, morphologyData );
		}
		// If the word has more than 2 syllables and ends in either -kan, -an, or -i suffixes, the suffix will be deleted here, e.g., anakan -> anak
		if ( calculateTotalNumberOfSyllables( word ) > 2 ) {
			word = removeEnding( word, removeSuffixRules, removeSuffixExceptions, morphologyData );
		}
	} else {
		// If the word previously had a first order prefix, assign wordLength to the length of the word after prefix deletion.
		wordLength = word.length;
		/*
		 * If the word after first order prefix deletion is bigger than 2 and ends in either -kan, -an, or -i suffixes,
		 * the suffix will be stemmed here. e.g. penyebaran - sebar.
		 */
		if ( calculateTotalNumberOfSyllables( word ) > 2 ) {
			word = removeEnding( word, removeSuffixRules, removeSuffixExceptions, morphologyData );
		}
		/*
		 * If the word previously had a suffix, we check further if the word after first order prefix and suffix deletion has more than 2 syllables.
		 * If it does have more than 2 syllables and starts with one of the second order prefixes (i.e. ber-, be-, per-, pe-), the prefix will
		 * be stemmed here unless the word is in the exception list of words with a beginning that looks like a second order prefix.
		 */
		if ( wordLength !== word.length && ! doNotStemSecondOrderPrefix.includes( word ) ) {
			if ( calculateTotalNumberOfSyllables( word ) > 2 ) {
				word = removeSecondOrderPrefix( word, morphologyData );
			}
		}
	}
	return word;
};

/**
 * Stems Indonesian singular words.
 *
 * @param {string} word           The singular word to stem.
 * @param {Object} morphologyData The object that contains regex-based rules and exception lists for Indonesian stemming.
 *
 * @returns {string} The stem of an Indonesian singular word.
 */
const stemSingular = function( word, morphologyData ) {
	const singleSyllableWords = stemSingleSyllableWords( word, morphologyData );
	// Stem the single syllable words
	word = singleSyllableWords;

	const doNotStemParticle = morphologyData.stemming.doNotStemWords.doNotStemParticle;
	const doNotStemPronoun = morphologyData.stemming.doNotStemWords.doNotStemPronounSuffix;

	if ( calculateTotalNumberOfSyllables( word ) <= 2 ) {
		return word;
	}

	// Check if a word after its derivational affixes stemmed exists in the exception list.
	const firstDerivationalStem = stemDerivational( word, morphologyData );
	if ( doNotStemParticle.includes( firstDerivationalStem ) || doNotStemPronoun.includes( firstDerivationalStem ) ) {
		// If it does exist in the exception list, the ending that looks like a particle or a pronoun suffix should not be stemmed.
		return firstDerivationalStem;
	}

	/*
	 * If the word has more than 2 syllables and ends in of the particle endings (i.e. -kah, -lah, -pun), stem the particle here.
	 * e.g. bajumulah -> bajumu, bawalah -> bawa
	 */
	word = removeEnding( word, morphologyData.stemming.regexRules.removeParticle, doNotStemParticle, morphologyData );

	// If the word (still) has more than 2 syllables and ends in of the possessive pronoun endings (i.e. -ku, -mu, -nya), stem the ending here.
	if ( calculateTotalNumberOfSyllables( word ) > 2 ) {
		// E.g. bajumu -> baju
		word = removeEnding( word, morphologyData.stemming.regexRules.removePronoun, doNotStemPronoun, morphologyData );
	}

	// If the word (still) has more than 2 syllables and has derivational affixes, the affix(es) will be stemmed here.
	if ( calculateTotalNumberOfSyllables( word ) > 2  ) {
		word = stemDerivational( word, morphologyData );
	}
	return word;
};

/**
 * Stems Indonesian plural words.
 *
 * @param {string} word           The plural word to stem.
 * @param {Object} morphologyData The object that contains regex-based rules and exception lists for Indonesian stemming.
 *
 * @returns {string|null} The stem of an Indonesian plural word or null if no plural was detected.
 */
const stemPlural = function( word, morphologyData ) {
	const hyphenIndex = word.indexOf( "-" );

	// If there is no hyphen in the word, it can't be a reduplicated plural.
	if ( hyphenIndex === -1  ) {
		return null;
	}

	const splitWord = word.split( "-" );

	if ( splitWord.length === 2 ) {
		let firstPart = splitWord[ 0 ];
		let secondPart = splitWord[ 1 ];

		firstPart = stemSingular( firstPart, morphologyData );
		secondPart = stemSingular( secondPart, morphologyData );

		/*
		 * To compare the first and second part and see whether it's actually a reduplication:
		 * Trim the beginning of the word since it might be variable due to stem changes caused by prefixes.
		 * For example, in "meniru-nirukan" the singular stemmer will correctly stem the first "niru" to "tiru" because
		 * of the prefix "me". Since the second part of the word is stemmed individually, there is no "me" and hence
		 * "niru" remains "niru". To still be able to link these two forms to each other,
		 * we compare the two parts of the word after stripping the variable first or first and second letter.
		 *
		 */
		const firstPartBeginningTrimmed = firstPart.substring( 1 );
		const secondPartBeginningTrimmed = ( secondPart.startsWith( "ng" ) || secondPart.startsWith( "ny" ) )
			? secondPart.substring( 2 )
			: secondPart.substring( 1 );

		if ( firstPartBeginningTrimmed === secondPartBeginningTrimmed ) {
			const nonPlurals = morphologyData.stemming.nonPluralReduplications;

			// Check non-plural reduplication.
			if ( nonPlurals.includes( firstPart ) && nonPlurals.includes( secondPart ) ) {
				/*
				 * In words such as "mengira-ngira" prefix "me" causes a modification on both words (k->ng). This will
				 * be correctly stemmed for the first word, but not the second. Therefore, the correct base form
				 * "kira-kira" is created based on a reduplication of the correctly stemmed first part, "kira".
				 */
				return firstPart + "-" + firstPart;
			}

			// Return the stemmed singular form of a reduplicated plural.
			return firstPart;
		}
	}

	return null;
};

/**
 * Stems Indonesian words
 *
 * @param {string} word           The word to stem.
 * @param {Object} morphologyData The object that contains regex-based rules and exception lists for Indonesian stemming.
 *
 * @returns {string} The stem of an Indonesian word.
 */
export default function stem( word, morphologyData ) {
	// Check words that shouldn't receive any stemming.
	if ( morphologyData.stemming.shouldNotBeStemmed.includes( word ) ) {
		return word;
	}

	const stemmedPlural = stemPlural( word, morphologyData );

	if ( stemmedPlural ) {
		return stemmedPlural;
	}

	word = stemSingular( word, morphologyData );

	return word;
}
