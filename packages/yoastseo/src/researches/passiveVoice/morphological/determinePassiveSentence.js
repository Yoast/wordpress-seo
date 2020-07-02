import { filter, flattenDeep } from "lodash-es";
import getWords from "../../../stringProcessing/getWords.js";

// Verb-form lists per language
import getPassiveVerbsRussianFactory from "../../russian/passiveVoice/participlesShortenedList.js";
const getPassiveVerbsRussian = getPassiveVerbsRussianFactory().all;

import getPassiveVerbsSwedishFactory from "../../swedish/passiveVoice/participles.js";
const getPassiveVerbsSwedish = getPassiveVerbsSwedishFactory().all;

const indonesianPassiveRegexes = [ /^(di|ter)\S+($|[ \n\r\t.,'()"+\-;!?:/»«‹›<>])/ig ];

/**
 * Returns words that have been determined to be a passive through a regex.
 *
 * @param {string} sentence  The sentence to check.
 * @param {array} regexes   The regexes to match.
 *
 * @returns {Array}          A list with the matches.
 */
const matchPassiveVerbsWithRegexes = function( sentence, regexes ) {
	// Matches words in a sentence with language-specific passive regexes.

	return filter( getWords( sentence ), function( word ) {
		regexes.forEach( function( regex )  {
			console.log ( word.match );
			return word.match( regex );
		} );
	} );

	// regexes.forEach( function( regex ) {
	// 	const match = sentence.match( regex );
	// 	if ( match !== null ) {
	// 		matches.push( match );
	// 	}
	// } );

};


/**
 * Matches the sentence against passive verbs.
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
			passiveData = indonesianPassiveRegexes;
			typeOfData = "regex";
			break;
	}
	if ( typeOfData === "list" ) {
		return matchPassiveVerbsWithLists( sentence, passiveData ).length !== 0;
	} return matchPassiveVerbsWithRegexes( sentence, passiveData ).length !== 0;
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
