import { checkIfWordEndingIsOnExceptionList, checkIfWordIsOnVerbExceptionList } from "../../../../helpers/morphology/exceptionListHelpers";
import { removeSuffixFromFullForm, removeSuffixesFromFullForm } from "../../../../helpers/morphology/stemHelpers";
import detectAndStemSuffixes from "./detectAndStemSuffixes";
import { generateCorrectStemWithTAndDEnding } from "./getStemWordsWithTAndDEnding.js";
import checkExceptionsWithFullForms from "../../../../helpers/morphology/checkExceptionsWithFullForms";
import { detectAndStemRegularParticiple } from "./detectAndStemRegularParticiple";
import { modifyStem, isVowelDoublingAllowed } from "./stemModificationHelpers";

/**
 * Get the stem from noun diminutives and plurals exceptions.
 *
 * @param {Object}    morphologyDataNL The data for stemming exception.
 * @param {string}      word                                The word to check.
 *
 * @returns {string} The stemmed word.
 */
const removeSuffixFromFullForms = function( morphologyDataNL,  word ) {
	/*
	 * Checks whether the word is in the exception list of words ending in -er and gets either -e or -s suffix
	 * If it is, remove the corresponding suffix.
	 * e.g. lekkere -> lekker, bitters -> bitter
	*/
	for ( const exceptionClass of morphologyDataNL.stemExceptions.removeSuffixesFromFullForms ) {
		const stemmedWord = removeSuffixesFromFullForm( exceptionClass.forms, exceptionClass.suffixes, word );
		if ( stemmedWord ) {
			return stemmedWord;
		}
	}
	/*
	 * Checks whether the word is in one of the exception lists of nouns
	 * for which a specific suffix needs to be stemmed (e.g. -s, -es, -eren, -er etc.)
	 * e.g. kuddes -> kud, modes -> mod, revenuen -> revenu
	 */
	for ( const exceptionClass of morphologyDataNL.stemExceptions.removeSuffixFromFullForms ) {
		const stemmedWord = removeSuffixFromFullForm( exceptionClass.forms, exceptionClass.suffix, word );
		if ( stemmedWord ) {
			return stemmedWord;
		}
	}
};

/**
 * Checks if the word is on a stemming exception list.
 *
 * @param {string} word The word to check.
 * @param {Object} morphologyDataNL The Dutch morphology data file.
 * @returns {string|null} The stem or null if the word was not matched by any of the exception checks.
 */
const checkOtherStemmingExceptions = function( word, morphologyDataNL ) {
	/*
	 * Checks whether the word is in the exception list of nouns or adjectives with specific suffixes that needs to be stemmed.
	 * If it is return the stem here and run possible stem modification if it is required. e.g. modes -> mod -> mood
	 */
	let stemFromFullForm = removeSuffixFromFullForms( morphologyDataNL, word );
	if ( stemFromFullForm ) {
		if ( isVowelDoublingAllowed( stemFromFullForm, morphologyDataNL.regularStemmer.stemModifications.exceptionsStemModifications,
			morphologyDataNL.pastParticipleStemmer.compoundVerbsPrefixes ) ) {
			stemFromFullForm = modifyStem( stemFromFullForm, morphologyDataNL.regularStemmer.stemModifications.doubleVowel );
			return modifyStem( stemFromFullForm, morphologyDataNL.regularStemmer.stemModifications.finalChanges );
		}
		return modifyStem( stemFromFullForm, morphologyDataNL.regularStemmer.stemModifications.finalChanges );
	}
	return null;
};

/**
 * Stems Dutch words.
 *
 * @param {string} word  The word to stem.
 * @param {Object} morphologyDataNL The Dutch morphology data file.
 *
 * @returns {string} The stemmed word.
 */
export default function stem( word, morphologyDataNL ) {
	// Check whether the word is in the list of words with full forms for which we define the stem. If it is, return the canonical stem.
	let stemmedWord = checkExceptionsWithFullForms( morphologyDataNL, word );
	if ( stemmedWord ) {
		return stemmedWord;
	}

	// Check whether the word is a participle, and if yes, stem it and return the stem.
	stemmedWord = detectAndStemRegularParticiple( morphologyDataNL, word );
	if ( stemmedWord ) {
		return stemmedWord;
	}

	// Check whether the word is on the list of words that should not be stemmed, and if yes, return the word. Example: gans -> gans
	const wordsNotToBeStemmed = morphologyDataNL.stemExceptions.wordsNotToBeStemmedExceptions;
	if ( checkIfWordIsOnVerbExceptionList( word, wordsNotToBeStemmed.verbs, morphologyDataNL.pastParticipleStemmer.compoundVerbsPrefixes ) ||
		 checkIfWordEndingIsOnExceptionList( word, wordsNotToBeStemmed.endingMatch ) ||
		 wordsNotToBeStemmed.exactMatch.includes( word ) ) {
		return word;
	}

	/*
	 * Check whether the word ends in -t/-te/-ten/-tend/-de/-den/-dend. If it does, run through a series of checks aimed at
	 * predicting whether the -t/d is part of the stem or the suffix. If the word was matched in one of the checks, stem it
	 * accordingly and return the stem. Example: boot -> boot, squasht -> squash
	 */
	const tAndDEndings = morphologyDataNL.ambiguousTAndDEndings.otherTAndDEndings;
	for ( const ending of tAndDEndings ) {
		if ( word.endsWith( ending ) ) {
			stemmedWord = generateCorrectStemWithTAndDEnding( morphologyDataNL, word );
			if ( stemmedWord ) {
				return stemmedWord;
			}
		}
	}

	// Check if the word is on any other stemming exception list, and if yes, return the correct stem.
	stemmedWord = checkOtherStemmingExceptions( word, morphologyDataNL );
	if ( stemmedWord ) {
		return stemmedWord;
	}

	// If the word was not stemmed in any of the previous steps, run through the stemming algorithm which detects and stems suffixes.
	return detectAndStemSuffixes( word, morphologyDataNL );
}
