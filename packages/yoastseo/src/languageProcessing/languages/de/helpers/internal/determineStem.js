import { flatten } from "lodash";
import { languageProcessing } from "yoastseo";
import { detectAndStemRegularParticiple } from "./detectAndStemRegularParticiple";

import stem from "./stem";

const { flattenSortLength } = languageProcessing;

/**
 * Returns a stem for a word that appears on the noun exception lists.
 *
 * @param {array[]}	exceptionList	The exception list to check.
 * @param {string}	stemmedWord		The stem to check.
 *
 * @returns {string|null} The stemmed word or null if none was found.
 */
const findStemOnNounExceptionList = function( exceptionList, stemmedWord ) {
	for ( const exceptionStemSet of exceptionList ) {
		const matchedStem = exceptionStemSet.find( exceptionStem => stemmedWord.endsWith( exceptionStem ) );

		if ( matchedStem ) {
			const precedingLexicalMaterial = stemmedWord.slice( 0, stemmedWord.length - matchedStem.length );

			return precedingLexicalMaterial + exceptionStemSet[ 0 ];
		}
	}

	return null;
};

/**
 * Returns a stem for a word that appears on the adjective exception lists.
 *
 * @param {Object}  morphologyDataAdjectives    The German morphology data for adjectives.
 * @param {string}  stemmedWord                 The stem to check.
 *
 * @returns {string|null} The stemmed word or null if none was found.
 */
const findStemOnAdjectiveExceptionList = function( morphologyDataAdjectives, stemmedWord ) {
	const adjectiveExceptionClasses = morphologyDataAdjectives.exceptions;

	for ( const key of Object.keys( adjectiveExceptionClasses ) ) {
		const exceptionStems = adjectiveExceptionClasses[ key ];

		for ( const exceptionStemSet of exceptionStems ) {
			if ( exceptionStemSet.includes( stemmedWord ) ) {
				return ( exceptionStemSet[ 0 ] );
			}
		}
	}

	return null;
};

/**
 * Returns a stem for a word that appears on the verb exception lists.
 *
 * @param {Object}  morphologyDataVerbs The German morphology data for verbs.
 * @param {string}  stemmedWord         The stem to check.
 *
 * @returns {string|null} The stemmed word or null if none was found.
 */
const findStemOnVerbExceptionList = function( morphologyDataVerbs, stemmedWord ) {
	let wordToCheck = stemmedWord;
	const strongAndIrregularVerbStems = morphologyDataVerbs.strongAndIrregularVerbs.stems;
	const prefixes = flattenSortLength( morphologyDataVerbs.prefixes );

	let matchedPrefix = prefixes.find( prefix => stemmedWord.startsWith( prefix ) );

	if ( matchedPrefix ) {
		const wordWithoutPrefix = wordToCheck.slice( matchedPrefix.length, wordToCheck.length );

		/* At least 3 characters so that e.g. "be" is not found in the stem "berg". A minimum length of 3 was chosen
		 * as a safe option, since 2-letter verb stems are highly unlikely to impossible.
		 */
		if ( wordWithoutPrefix.length > 2 ) {
			wordToCheck = wordWithoutPrefix;
		} else {
			matchedPrefix = null;
		}
	}

	for ( const strongOrIrregularVerbParadigm of strongAndIrregularVerbStems ) {
		let stems = strongOrIrregularVerbParadigm.stems;
		stems = flatten( Object.values( stems ) );

		if ( stems.includes( wordToCheck ) ) {
			if ( matchedPrefix ) {
				// The present tense stem is returned as a default stem.
				return matchedPrefix + strongOrIrregularVerbParadigm.stems.present;
			}

			return strongOrIrregularVerbParadigm.stems.present;
		}
	}

	return null;
};

/**
 * Returns the stem for a given German input word.
 *
 * @param   {string} word                   The word to get the stem for.
 * @param   {Object} morphologyDataGerman   The German morphology data.
 *
 * @returns {string} Stemmed form of the word.
 */
export default function determineStem( word, morphologyDataGerman ) {
	// Already return the stem here if the word contains umlaut and ends with an ending that looks like a valid suffix, e.g. "läden" stemmed to "laden".
	const umlautException = morphologyDataGerman.nouns.umlautException || [];
	const findUmlautException = findStemOnNounExceptionList( umlautException, word );
	if ( findUmlautException ) {
		return findUmlautException;
	}

	const verbData = morphologyDataGerman.verbs;
	const stemmedWord = stem( verbData, word );

	/*
	 * Goes through the stem exception functions from left to right, returns the first stem it finds.
	 * If no stem has been found, return the original, programmatically created, stem.
	 */
	return findStemOnNounExceptionList( morphologyDataGerman.nouns.exceptionStems, stemmedWord ) ||
		findStemOnAdjectiveExceptionList( morphologyDataGerman.adjectives, stemmedWord ) ||
		findStemOnVerbExceptionList( verbData, stemmedWord ) ||
		detectAndStemRegularParticiple( verbData, word ) ||
		stemmedWord;
}
