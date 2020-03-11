import { checkIfWordEndingIsOnExceptionList, checkIfWordIsOnVerbExceptionList } from "../morphoHelpers/exceptionListHelpers";
import { removeSuffixFromFullForm } from "../morphoHelpers/stemHelpers";
import detectAndStemSuffixes from "./detectAndStemSuffixes";
import { generateCorrectStemWithTAndDEnding } from "./getStemWordsWithTAndDEnding.js";
import checkExceptionsWithFullForms from "../morphoHelpers/checkExceptionsWithFullForms";
import { detectAndStemRegularParticiple } from "./detectAndStemRegularParticiple";

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
 * @param {Object[]}    exceptionsRemoveSuffixFromFullForms The data for stemming exception.
 * @param {string}      word                                The word to check.
 *
 * @returns {string} The stemmed word.
 */
const removeSuffixFromFullForms = function( exceptionsRemoveSuffixFromFullForms, word ) {
	for ( const exceptionClass of exceptionsRemoveSuffixFromFullForms ) {
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
 * @param {Object} morphologyDataNLStemming The Dutch morphology data file.
 * @returns {string|null} The stem or null if the word was not matched by any of the exception checks.
 */
const checkOtherStemmingExceptions = function( word, morphologyDataNLStemming ) {
	/*
	 * Check whether the word is on an exception list of adjectives with stem ending in -rd. If it is, stem and
	 * return the word here, instead of going through the regular stemmer.
 	 */
	const wordAfterRdExceptionCheck = stemAdjectiveEndingInRd( word, morphologyDataNLStemming.stemExceptions.adjectivesEndInRD );
	if ( wordAfterRdExceptionCheck !== word ) {
		return wordAfterRdExceptionCheck;
	}
	/* Checks whether the word is in the exception list of nouns with specific diminutive or plural suffixes that needs to be stemmed.
	 * If it is return the stem here.
	 */
	const stemFromFullForm = removeSuffixFromFullForms( morphologyDataNLStemming.stemExceptions.removeSuffixFromFullForms, word );
	if ( stemFromFullForm ) {
		return stemFromFullForm;
	}

	/*
	 * Checks whether the word is in the ending match sub-list of diminutives that need to be stemmed and that additionally need
	 * to have the final vowel removed. If it is return the stem here. Example: zwemdiplomaatje -> zwemdiplomaa -> zwemdiploma
	 */
	const stemFromFullFormAndDeleteFinalVowelEndingMatch = removeSuffixFromFullForm(
		morphologyDataNLStemming.stemExceptions.stemTjeAndOnePrecedingVowel.forms.endingMatch,
		morphologyDataNLStemming.stemExceptions.stemTjeAndOnePrecedingVowel.suffix,
		word
	);

	if ( stemFromFullFormAndDeleteFinalVowelEndingMatch ) {
		return stemFromFullFormAndDeleteFinalVowelEndingMatch.slice( 0, -1 );
	}

	/*
	 * Checks whether the word is in the exact match sub-list of diminutives that need to be stemmed and that additionally need
	 * to have the final vowel removed. If it is return the stem here. Example: omaatje -> omaa -> oma
	 */
	if ( morphologyDataNLStemming.stemExceptions.stemTjeAndOnePrecedingVowel.forms.exactMatch.includes( word ) ) {
		return word.slice( 0, -4 );
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
	stemmedWord = checkOtherStemmingExceptions( word, morphologyDataNL.stemming );
	if ( stemmedWord ) {
		return stemmedWord;
	}

	// If the word was not stemmed in any of the previous steps, run through the stemming algorithm which detects and stems suffixes.
	return detectAndStemSuffixes( word, morphologyDataNL );
}
