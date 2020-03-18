import { checkIfWordEndingIsOnExceptionList, checkIfWordIsOnVerbExceptionList } from "../morphoHelpers/exceptionListHelpers";
import { removeSuffixFromFullForm, removeSuffixesFromFullForm } from "../morphoHelpers/stemHelpers";
import detectAndStemSuffixes from "./detectAndStemSuffixes";
import { generateCorrectStemWithTAndDEnding } from "./getStemWordsWithTAndDEnding.js";
import checkExceptionsWithFullForms from "../morphoHelpers/checkExceptionsWithFullForms";
import { detectAndStemRegularParticiple } from "./detectAndStemRegularParticiple";
import { modifyStem, isVowelDoublingAllowed } from "./stemModificationHelpers";

/**
 * Check whether the word is a comparative adjective with a stem ending in -rd. If yes, stem it (the regular stemmer
 * would incorrectly stem the d).
 * @param {string} word The word to check.
 * @param {Object} adjectivesEndingInRd The exception list of adjectives with stem ending in -rd.
 * @returns {string} The stemmed word or the original word if it was not matched with the exception list.
 */
const stemAdjectiveEndingInRd = function( word, adjectivesEndingInRd ) {
	for ( const adjective of adjectivesEndingInRd ) {
		const regex = new RegExp( adjective + "er[se]?$" );
		if ( word.search( regex ) !== -1 ) {
			if ( word.endsWith( "er" ) ) {
				return word.slice( 0, -2 );
			}
			return word.slice( 0, -3 );
		}
	} return word;
};

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
	for ( const exceptionClass of morphologyDataNL.stemming.stemExceptions.removeSuffixesFromFullForms ) {
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
	for ( const exceptionClass of morphologyDataNL.stemming.stemExceptions.removeSuffixFromFullForms ) {
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
	 * Check whether the word is on an exception list of adjectives with stem ending in -rd. If it is, stem and
	 * return the word here, instead of going through the regular stemmer.
 	 */
	const wordAfterRdExceptionCheck = stemAdjectiveEndingInRd( word, morphologyDataNL.stemming.stemExceptions.adjectivesEndInRD );
	if ( wordAfterRdExceptionCheck !== word ) {
		return wordAfterRdExceptionCheck;
	}
	/*
	 * Checks whether the word is in the exception list of nouns or adjectives with specific suffixes that needs to be stemmed.
	 * If it is return the stem here and run possible stem modification if it is required. e.g. modes -> mod -> mood
	 */
	let stemFromFullForm = removeSuffixFromFullForms( morphologyDataNL, word );
	if ( stemFromFullForm ) {
		const checkIfDoublingVowelIsNeeded = isVowelDoublingAllowed( stemFromFullForm, morphologyDataNL.stemming.stemExceptions,
			morphologyDataNL.verbs.compoundVerbsPrefixes );
		if ( checkIfDoublingVowelIsNeeded ) {
			stemFromFullForm = modifyStem( stemFromFullForm, morphologyDataNL.stemming.stemModifications.doubleVowel );
			return modifyStem( stemFromFullForm, morphologyDataNL.stemming.stemModifications.finalChanges );
		}
		return modifyStem( stemFromFullForm, morphologyDataNL.stemming.stemModifications.finalChanges );
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
	const wordsNotToBeStemmed = morphologyDataNL.stemming.stemExceptions.wordsNotToBeStemmedExceptions;
	if ( checkIfWordIsOnVerbExceptionList( word, wordsNotToBeStemmed.verbs, morphologyDataNL.verbs.compoundVerbsPrefixes ) ||
		 checkIfWordEndingIsOnExceptionList( word, wordsNotToBeStemmed.endingMatch ) ||
		 wordsNotToBeStemmed.exactMatch.includes( word ) ) {
		return word;
	}

	/*
	 * Check whether the word ends in -t/-te/-ten/-tend/-de/-den/-dend. If it does, run through a series of checks aimed at
	 * predicting whether the -t/d is part of the stem or the suffix. If the word was matched in one of the checks, stem it
	 * accordingly and return the stem. Example: boot -> boot, squasht -> squash
	 */
	const tAndDEndings = morphologyDataNL.stemming.stemExceptions.ambiguousTAndDEndings.otherTAndDEndings;
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
