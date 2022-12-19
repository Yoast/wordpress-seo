import wordComplexityConfig from "../config/internal/wordComplexity";
import functionWords from "../config/functionWords";


const vowels = "aeiuoyáéíóúñ";
const consonants = "bcdfghjklmnpqrstvwxzñ";

const vowelsSuffix = "[" + vowels + "](s)$";
const vowelsSuffixRegex = new RegExp( vowelsSuffix );

const consonantSuffix = "[" + consonants + "](es)$";
const consonantSuffixRegex = new RegExp( consonantSuffix );

const suffixes = "(s|es)$";
const suffixesRegex = new RegExp( suffixes );

const lengthLimit = wordComplexityConfig.wordLength;
const frequencyList = wordComplexityConfig.frequencyList;

/**
 * Checks if a word is complex.
 *
 * @param {string} word The word to check.
 *
 * @returns {boolean} Whether or not a word is complex.
 */
export default function checkIfWordIsComplex( word ) {
	// The Spanish word is not complex if its length is 7 characters or fewer.
	if ( word.length <= lengthLimit ) {
		return false;
	}

	// The Spanish word starts with a capital and thus is assumed to be a named entity.
	if ( word[ 0 ].toLowerCase() !== word[ 0 ] ) {
		return false;
	}

	// The word is not complex if it's in the frequency list or the function words list.
	if ( frequencyList.includes( word ) || functionWords.all.includes( word )  ) {
		return false;
	}
	/*
	* If a word is longer than 7 characters and has a plural ending in -es or -s, we remove the ending
	* and check if the singular form can be found in the frequency list.
	* The word is not complex if the singular form is in the list.
	*/
	// It's important to check consonant suffixes before vowel suffixes so order should not be altered.
	if ( consonantSuffixRegex.test( word ) ) {
		word = word.replace( suffixesRegex, "" );
		return ! frequencyList.includes( word );
	} else if ( vowelsSuffixRegex.test( word ) ) {
		word = word.replace( suffixesRegex, "" );
		return ! frequencyList.includes( word );
	}

	return true;
}
