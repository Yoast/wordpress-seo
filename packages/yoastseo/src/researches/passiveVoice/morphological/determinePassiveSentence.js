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
 * @param {string} sentence The sentence to match against.
 * @param {Array} passiveVerbs The array containing passive verb-forms.
 * @returns {Array} The found passive verbs.
 */
const matchPassiveVerbs = function( sentence, passiveVerbs ) {
	return filter( getWords( sentence ), function( word ) {
		return passiveVerbs.includes( word.toLocaleLowerCase() );
	} );
};

/**
 * Checks the passed sentence to see if it contains passive verb-forms.
 *
 * @param {string} sentence The sentence to match against.
 * @param {string} language The language of the text.
 * @returns {Boolean} Whether the sentence contains passive voice.
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
 * @param {string} sentence The sentence to match against.
 * @returns {Boolean} Whether the sentence contains Indonesian passive voice.
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
 * @param {string} sentence The sentence to match against.
 * @returns {Boolean} Whether the sentence contains Arabic passive voice.
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
 * Checks the passed sentence to see if it contains Hebrew passive verb-forms.
 *
 * @param {string} sentence    The sentence to match against.
 * @returns {Boolean}          Whether the sentence contains Hebrew passive voice.
 */
const determineSentenceIsPassiveHebrew = function( sentence ) {
	const words = getWords( sentence );
	const matchedPassives = [];
	for ( const word of words ) {
		// Check if the root is in nif'al.
		for ( const root of getNifalVerbsHebrew ) {
			// The list of prefixes and suffixes for nif'al.
			const nifalPrefix1 = "נ";
			const nifalSuffixes1 = "(ים|ת|ות|תי|ה|נו|תם|תן|ו)";
			const nifalPrefixes2 = "(תי|הי)";
			const nifalSuffixes2 = "(י|ו|נה)";
			const nifalPrefix3 = "יי";
			const nifalSuffix3 = "ו";
			const nifalPrefixes = "(נ|אי|תי|הי|יי|ני|להי)";
			// The regexes to match the root with a nif'al pattern.
			const pattern1 = new RegExp( "^" + nifalPrefix1 + root + nifalSuffixes1 + "$" );
			const pattern2 = new RegExp( "^" + nifalPrefixes2 + root + nifalSuffixes2 + "$" );
			const pattern3 = new RegExp( "^" + nifalPrefix3 + root + nifalSuffix3 + "$" );
			const pattern4 = new RegExp( "^" + nifalPrefixes + root + "$" );
			if ( pattern1.test( word ) || pattern2.test( word ) || pattern3.test( word ) || pattern4.test( word ) ) {
				matchedPassives.push( word );
			}
		}
		// Check if the root is in pu'al.
		for ( const root of getPualVerbsHebrew ) {
			// The list of prefixes and suffixes for pu'al.
			const pualPrefix1 = "נ";
			const pualSuffixes1 = "(ים|ת|ות|תי|ה|נו|תם|תן|ו)";
			const pualPrefixes2 = "(תי|הי)";
			const pualSuffixes2 = "(י|ו|נה)";
			const pualPrefix3 = "יי";
			const pualSuffix3 = "ו";
			const pualPrefixes = "(נ|אי|תי|הי|יי|ני|להי)";
			// The regexes to match the root with a pu'al pattern.
			const pattern1 = new RegExp( "^" + pualPrefix1 + root + pualSuffixes1 + "$" );
			const pattern2 = new RegExp( "^" + pualPrefixes2 + root + pualSuffixes2 + "$" );
			const pattern3 = new RegExp( "^" + pualPrefix3 + root + pualSuffix3 + "$" );
			const pattern4 = new RegExp( "^" + pualPrefixes + root + "$" );
			if ( pattern1.test( word ) || pattern2.test( word ) || pattern3.test( word ) || pattern4.test( word ) ) {
				matchedPassives.push( word );
			}
		}
		// Check if the root is in huf'al.
		for ( const root of getHufalVerbsHebrew ) {
			// The list of prefixes and suffixes for huf'al.
			const hufalPrefix1 = "מו";
			const hufalSuffixes1 = "(ת|ים|ות)";
			const hufalPrefix2 = "הו";
			const hufalSuffixes2 = "(תי|ת|ית|ה|נו|תם|תן|ו)";
			const hufalPrefix3 = "תו";
			const hufalSuffix3 = "י";
			const hufalPrefix4 = "תו";
			const hufalSuffixes4 = "(ו|נה)";
			const hufalPrefix5 = "יו";
			const hufalSuffix5 = "ו";
			const hufalPrefixes = "(מו|הו|או|תו|יו|נו)";
			// The regexes to match the root with a huf'al pattern.
			const pattern1 = new RegExp( "^" + hufalPrefix1 + root + hufalSuffixes1 + "$" );
			const pattern2 = new RegExp( "^" + hufalPrefix2 + root + hufalSuffixes2 + "$" );
			const pattern3 = new RegExp( "^" + hufalPrefix3 + root + hufalSuffix3 + "$" );
			const pattern4 = new RegExp( "^" + hufalPrefix4 + root + hufalSuffixes4 + "$" );
			const pattern5 = new RegExp( "^" + hufalPrefix5 + root + hufalSuffix5 + "$" );
			const pattern6 = new RegExp( "^" + hufalPrefixes + root + "$" );
			if ( pattern1.test( word ) || pattern2.test( word ) || pattern3.test( word ) || pattern4.test( word ) ||
				pattern5.test( word ) || pattern6.test( word ) ) {
				matchedPassives.push( word );
			}
		}
	}
	// If it's in none of the above it's not a passive.
	return matchedPassives.length !== 0;
};

/**
 * Determines whether a sentence is passive.
 *
 * @param {string} sentenceText The sentence to determine voice for.
 * @param {string} language The language of the sentence part.

 * @returns {boolean} Returns true if passive, otherwise returns false.
 */
export default function( sentenceText, language ) {
	if ( [ "ru", "sv" ].includes( language ) ) {
		return determineSentenceIsPassiveListBased( sentenceText, language );
	}

	if ( language === "id" ) {
		return determineSentenceIsPassiveIndonesian( sentenceText, language );
	}

	if ( language === "ar" ) {
		return determineSentenceIsPassiveArabic( sentenceText, language );
	}
	if ( language === "he" ) {
		return determineSentenceIsPassiveHebrew( sentenceText, language );
	}
}
