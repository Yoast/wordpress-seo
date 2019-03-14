import { flatten } from "lodash-es";
import { detectAndStemRegularParticiple } from "./detectAndStemRegularParticiple";

import stem from "./stem";

/**
 * Returns a stem for a word that appears on the noun exception lists.
 *
 * @param {Object}  morphologyDataNouns The German morphology data for nouns.
 * @param {string}  stemmedWord         The stem to check.
 *
 * @returns {string|null} The stemmed word or null if none was found.
 */
const findStemOnNounExceptionList = function( morphologyDataNouns, stemmedWord ) {
	const exceptionStemsWithFullForms = morphologyDataNouns.exceptionStemsWithFullForms;

	for ( const exceptionSet of exceptionStemsWithFullForms ) {
		const exceptionStems = exceptionSet[ 0 ];

		const matchedStem = exceptionStems.find( exceptionStem => stemmedWord.endsWith( exceptionStem ) );

		if ( matchedStem ) {
			const precedingLexicalMaterial = stemmedWord.slice( 0, stemmedWord.length - matchedStem.length );

			return precedingLexicalMaterial + exceptionStems[ 0 ];
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
	const adjectiveExceptionClasses = {
		elStemChange: morphologyDataAdjectives.elStemChange,
		erStemChangeClass1: morphologyDataAdjectives.erStemChangeClass1,
		erStemChangeClass2: morphologyDataAdjectives.erStemChangeClass2,
		erStemChangeClass3: morphologyDataAdjectives.erStemChangeClass3,
		secondStemCompSup: morphologyDataAdjectives.secondStemCompSup,
		bothStemsCompSup: morphologyDataAdjectives.bothStemsCompSup,
	};

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
	const strongVerbStems = morphologyDataVerbs.strongVerbs.stems;
	const prefixes = morphologyDataVerbs.verbPrefixes;

	let matchedPrefix = prefixes.find( prefix => stemmedWord.startsWith( prefix ) );

	if ( matchedPrefix ) {
		const wordWithoutPrefix = wordToCheck.slice( matchedPrefix.length, wordToCheck.length );

		// At least 3 characters so that e.g. "be" is not found in the stem "berg".
		if ( wordWithoutPrefix.length > 2 ) {
			wordToCheck = wordWithoutPrefix;
		} else {
			matchedPrefix = null;
		}
	}

	for ( const strongVerbParadigm of strongVerbStems ) {
		let stems = strongVerbParadigm.stems;
		stems = flatten( Object.values( stems ) );

		if ( stems.includes( wordToCheck ) ) {
			if ( matchedPrefix ) {
				return matchedPrefix + stems[ 0 ];
			}

			return stems[ 0 ];
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
export function determineStem( word, morphologyDataGerman ) {
	const stemmedWord = stem( word );

	const nounException = findStemOnNounExceptionList( morphologyDataGerman.nouns, stemmedWord );

	if ( nounException ) {
		return nounException;
	}

	const adjectiveException = findStemOnAdjectiveExceptionList( morphologyDataGerman.adjectives, stemmedWord );

	if ( adjectiveException ) {
		return adjectiveException;
	}

	const verbException = findStemOnVerbExceptionList( morphologyDataGerman.verbs, stemmedWord );

	if ( verbException ) {
		return verbException;
	}

	const stemmedParticiple = detectAndStemRegularParticiple( morphologyDataGerman.verbs, word );

	if ( stemmedParticiple ) {
		return stemmedParticiple;
	}
	return stemmedWord;
}
