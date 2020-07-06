import { filter, flattenDeep, get, includes } from "lodash-es";
import getWords from "../../../stringProcessing/getWords.js";
import EnglishParticiple from "../../english/passiveVoice/EnglishParticiple";

// Verb-form lists per language
import getPassiveVerbsRussianFactory from "../../russian/passiveVoice/participlesShortenedList.js";
const getPassiveVerbsRussian = getPassiveVerbsRussianFactory().all;

import getPassiveVerbsSwedishFactory from "../../swedish/passiveVoice/participles.js";
const getPassiveVerbsSwedish = getPassiveVerbsSwedishFactory().all;

// Passive verb form regexes per language
const indonesianPassiveRegex = [ /^(di)\S+($|[ \n\r\t.,'()"+\-;!?:/»«‹›<>])/ig ];

// Exceptions data
import getPassiveVerbsExceptionsIndonesianFactory from "../../indonesian/passiveVoice/nonpassiveVerbsStartingDi";
const getPassiveVerbsExceptionsIndonesian = getPassiveVerbsExceptionsIndonesianFactory();
const indonesianDirectPrecedenceExceptions = [ "untuk" ];

/**
 * Checks whether the matched word(s) constitute(s) an exception and is therefore not a passive.
 *
 * @param {string} sentence  	   The sentence to check.
 * @param {array} foundPassives    An array with the found passive verbs.
 * @param {string} language    	   The language for which the passive analysis is being performed.
 *
 * @returns {boolean}          	   Whether the matched word is an exception to a passive or not.
 */
const checkPassiveExceptions = function( sentence, foundPassives, word, language ) {
	let nonPassivesExceptionList = [];
	let directPrecedenceExceptions = [];

	switch ( language ) {
		case "id":
			nonPassivesExceptionList =  getPassiveVerbsExceptionsIndonesian;
			directPrecedenceExceptions = indonesianDirectPrecedenceExceptions;
			break;
	}
	return nonPassivesExceptionList.includes( word.toLocaleLowerCase() );

};

// const matchPassiveVerbsWithLists = function( sentence, passiveVerbs ) {
// 	return filter( getWords( sentence ), function( word ) {
// 		return passiveVerbs.includes( word.toLocaleLowerCase() );
// 	} );
// };

// return filter( getWords( sentence ), function( word ) {
// EnglishParticiple.prototype.isNonVerbEndingEd = function() {
// 	If ( this.getType() === "irregular" ) {
// 		Return false;
// 	}
// 	Return includes( nonVerbsEndingEd, this.getParticiple() );
// };


/**
 * Returns words that have been determined to be a passive through a regex.
 *
 * @param {string} sentence  The sentence to check.
 * @param {array} regexes    The regexes to match.
 * @param {string} language  The language of the sentence.
 *
 * @returns {Array}          A list with the matches.
 */
const matchPassiveVerbsWithRegexes = function( sentence, regexes, language ) {
	const words = getWords( sentence );
	let matches = [];

	for ( const word of words ) {
		regexes.forEach( function( regex )  {
			const match = word.match( regex );
			if ( match !== null ) {
				matches.push( match );
			}
		} );
	}

	matches = flattenDeep( matches );

	// Check exceptions.
	if ( matches.length !== 0 ) {
		if ( checkPassiveExceptions( sentence, regexes, language ) ) {
			matches = [];
		}
	}

	return matches;
};


/**
 * Matches the sentence against a list of passive verbs.
 *
 * @param {string} sentence     The sentence to match against.
 * @param {Array} passiveVerbs  The array containing passive verb-forms.
 *
 * @returns {Array}             The found passive verbs.
 */
const matchPassiveVerbsWithLists = function( sentence, passiveVerbs ) {
	return filter( getWords( sentence ), function( word ) {
		return passiveVerbs.includes( word.toLocaleLowerCase() );
	} );
};

/**
 * Checks the passed sentences to see if they contain passive verb-forms.
 *
 * @param {string} sentence  The sentence to match against.
 * @param {string} language  The language of the text.
 *
 * @returns {Array}          The list of encountered passive verbs.
 */
const determineSentenceIsPassive = function( sentence, language ) {
	let passiveData = [];
	let typeOfData = "";

	switch ( language ) {
		case "ru":
			passiveData = getPassiveVerbsRussian;
			typeOfData = "list";
			break;
		case "sv":
			passiveData = getPassiveVerbsSwedish;
			typeOfData = "list";
			break;
		case "id":
			passiveData = indonesianPassiveRegex;
			typeOfData = "regex";
			break;
	}
	if ( typeOfData === "list" ) {
		return checkPassiveExceptions( sentence, passiveData, language, typeOfData ).length !== 0;
	}
	if ( typeOfData === "list" ) {
		return matchPassiveVerbsWithLists( sentence, passiveData ).length !== 0;
	} return matchPassiveVerbsWithRegexes( sentence, passiveData, language ).length !== 0;
};

/**
 * Determines whether a sentence is passive.
 *
 * @param {string} sentenceText  The sentence to determine voice for.
 * @param {string} language      The language of the sentence part.
 *
 * @returns {boolean}            Returns true if passive, otherwise returns false.
 */
export default function( sentenceText, language ) {
	return determineSentenceIsPassive( sentenceText, language );
}
