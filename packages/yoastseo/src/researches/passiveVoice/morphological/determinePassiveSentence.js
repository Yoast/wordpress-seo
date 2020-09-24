import { filter } from "lodash-es";
import getWords from "../../../stringProcessing/getWords.js";

// Verb-form lists per language
import getPassiveVerbsRussianFactory from "../../russian/passiveVoice/participlesShortenedList.js";
const getPassiveVerbsRussian = getPassiveVerbsRussianFactory().all;

import getPassiveVerbsSwedishFactory from "../../swedish/passiveVoice/participles.js";
const getPassiveVerbsSwedish = getPassiveVerbsSwedishFactory().all;

const passivePrefixIndonesian = "di";
import nonPassivesIndonesianFactory from "../../indonesian/passiveVoice/nonPassiveVerbsStartingDi";
const nonPassivesIndonesian = nonPassivesIndonesianFactory();

import getPassiveVerbsArabicFactory from "../../arabic/passiveVoice/passiveVerbsWithLongVowel";
const getPassiveVerbsArabic = getPassiveVerbsArabicFactory();

import getNifalVerbsHebrewFactory from "../../hebrew/passiveVoice/regularRootsNifal";
const getNifalVerbsHebrew = getNifalVerbsHebrewFactory();

import getPualVerbsHebrewFactory from "../../hebrew/passiveVoice/regularRootsPual";
const getPualVerbsHebrew = getPualVerbsHebrewFactory();

import getHufalVerbsHebrewFactory from "../../hebrew/passiveVoice/regularRootsHufal";
const getHufalVerbsHebrew = getHufalVerbsHebrewFactory();

/**
 * Matches the sentence against passive verbs.
 *
 * @param {string} sentence       The sentence to match against.
 * @param {Array}  passiveVerbs   The array containing passive verb-forms.
 *
 * @returns {Array}               The found passive verbs.
 */
const matchPassiveVerbs = function( sentence, passiveVerbs ) {
	return filter( getWords( sentence ), function( word ) {
		return passiveVerbs.includes( word.toLocaleLowerCase() );
	} );
};

/**
 * Checks the passed sentence to see if it contains passive verb-forms.
 *
 * @param {string} sentence   The sentence to match against.
 * @param {string} language   The language of the text.
 *
 * @returns {Boolean}         Whether the sentence contains passive voice.
 */
const determineSentenceIsPassiveListBased = function( sentence, language ) {
	let passiveVerbs = [];

	switch ( language ) {
		case "ru":
			passiveVerbs = getPassiveVerbsRussian;
			break;
		case "sv":
			passiveVerbs = getPassiveVerbsSwedish;
			break;
	}
	return matchPassiveVerbs( sentence, passiveVerbs ).length !== 0;
};

/**
 * Checks the passed sentence to see if it contains Indonesian passive verb-forms.
 *
 * @param {string} sentence   The sentence to match against.
 *
 * @returns {Boolean}         Whether the sentence contains Indonesian passive voice.
 */
const determineSentenceIsPassiveIndonesian = function( sentence ) {
	const words = getWords( sentence );
	let matchedPassives = words.filter( word => ( word.startsWith( passivePrefixIndonesian ) ) );

	if ( matchedPassives.length === 0 ) {
		return false;
	}

	// Check exception list.
	matchedPassives = matchedPassives.filter( matchedPassive => ( ! nonPassivesIndonesian.includes( matchedPassive ) ) );

	if ( matchedPassives.length === 0 ) {
		return false;
	}

	// Check direct precedence exceptions.
	matchedPassives = matchedPassives.filter( function( matchedPassive ) {
		let matchedPassivesShouldStay = true;
		const passiveIndex = words.indexOf( matchedPassive );
		const wordPrecedingPassive = words[ passiveIndex - 1 ];
		if ( wordPrecedingPassive === "untuk" ) {
			matchedPassivesShouldStay = false;
		}
		return matchedPassivesShouldStay;
	} );

	return matchedPassives.length !== 0;
};

/**
 * Checks the passed sentence to see if it contains Arabic passive verb-forms.
 *
 * @param {string} sentence     The sentence to match against.
 *
 * @returns {Boolean}           Whether the sentence contains Arabic passive voice.
 */
const determineSentenceIsPassiveArabic = function( sentence ) {
	const arabicPrepositionalPrefix =  "و";
	const words = getWords( sentence );
	const passiveVerbs = [];

	for ( let word of words ) {
		// Check if the word starts with prefix و
		if ( word.startsWith( arabicPrepositionalPrefix ) ) {
			word = word.slice( 1 );
		}
		let wordWithDamma = -1;
		// Check if the first character has a damma or if the word is in the list of Arabic passive verbs
		if ( word.length >= 2 ) {
			wordWithDamma = word[ 1 ].search( "\u064F" );
		}
		if ( wordWithDamma !== -1 || getPassiveVerbsArabic.includes( word ) ) {
			passiveVerbs.push( word );
		}
	}

	return passiveVerbs.length !== 0;
};

/**
 * Checks if the input word's root is in the Hebrew verb roots list.
 *
 * @param {string} word         The word to check.
 * @param {[]} verbRootsList    The Hebrew verb roots list.
 * @param {string[]} prefixes   The list of prefixes.
 * @param {string[]} suffixes   The list of suffixes.
 *
 * @returns {Boolean}           Returns true if the root of the input word is in the list.
 */
const checkHebrewVerbRootsList = function( word, verbRootsList, prefixes, suffixes ) {
	for ( const root of verbRootsList ) {
		for ( let i = 0; i < prefixes.length; i++ ) {
			const pattern =  new RegExp( "^" + prefixes[ i ] + root + suffixes[ i ] + "$" );
			if ( pattern.test( word ) ) {
				return true;
			}
		}
	}
};

/**
 * Checks the passed sentence to see if it contains Hebrew passive verb-forms.
 *
 * @param {string} sentence    The sentence to match against.
 *
 * @returns {Boolean}          Whether the sentence contains Hebrew passive voice.
 */
const determineSentenceIsPassiveHebrew = function( sentence ) {
	const words = getWords( sentence );
	const matchedPassives = [];
	for ( const word of words ) {
		// Check if the root is in nif'al.
		const nifalPrefixes = [ "נ", "(תי|הי)", "יי", "(נ|אי|תי|הי|יי|ני|להי)" ];
		const nifalSuffixes = [ "(ים|ת|ות|תי|ה|נו|תם|תן|ו)", "(י|ו|נה)", "ו", "" ];
		const nifalPassive = checkHebrewVerbRootsList( word, getNifalVerbsHebrew, nifalPrefixes, nifalSuffixes );
		if ( nifalPassive ) {
			matchedPassives.push( word );
		}
		// Check if the root is in pu'al.
		for ( const root of getPualVerbsHebrew ) {
			// The list of prefixes and suffixes for pu'al.
			const pualPrefixes = [ "מ", "ת", "י", "תי", "(מ|א|ת|י|נ)", "" ];
			const pualSuffixes = [ "(ת|ים|ות)", "(י|ו|נה)", "ו", "נה", "", "(תי|ת|ה|נו|תם|תן|ו)" ];
			const pualInfix = "ו";
			for ( let i = 0; i < pualPrefixes.length; i++ ) {
				const pualPattern = new RegExp( "^" + pualPrefixes[ i ] + root[ 0 ] + pualInfix + root[ 1 ] + root[ 2 ] + pualSuffixes[ i ] + "$" );
				if ( pualPattern.test( word ) ) {
					matchedPassives.push( word );
				}
			}
		}
		// Check if the root is in huf'al.
		const hufalPrefixes = [ "מו", "הו", "תו", "תו", "תו", "יו", "(מו|הו|או|תו|יו|נו)" ];
		const hufalSuffixes = [ "(ת|ים|ות)", "(תי|ת|ית|ה|נו|תם|תן|ו)", "י", "(ו|נה)", "ו", "" ];
		const hufalPassive = checkHebrewVerbRootsList( word, getHufalVerbsHebrew, hufalPrefixes, hufalSuffixes );
		if ( hufalPassive ) {
			matchedPassives.push( word );
		}
	}
	return matchedPassives.length !== 0;
};

/**
 * Determines whether a sentence is passive.
 *
 * @param {string} sentenceText     The sentence to determine voice for.
 * @param {string} language         The language of the sentence part.
 *
 * @returns {boolean}               Returns true if passive, otherwise returns false.
 */
export default function( sentenceText, language ) {
	if ( [ "ru", "sv" ].includes( language ) ) {
		return determineSentenceIsPassiveListBased( sentenceText, language );
	}

	if ( language === "id" ) {
		return determineSentenceIsPassiveIndonesian( sentenceText );
	}

	if ( language === "ar" ) {
		return determineSentenceIsPassiveArabic( sentenceText );
	}
	if ( language === "he" ) {
		return determineSentenceIsPassiveHebrew( sentenceText );
	}
}
