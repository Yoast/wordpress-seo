import { filter, flattenDeep } from "lodash-es";
import getWords from "../../../stringProcessing/getWords.js";

// Verb-form lists per language
import getPassiveVerbsRussianFactory from "../../russian/passiveVoice/participlesShortenedList.js";
const getPassiveVerbsRussian = getPassiveVerbsRussianFactory().all;

import getPassiveVerbsSwedishFactory from "../../swedish/passiveVoice/participles.js";
const getPassiveVerbsSwedish = getPassiveVerbsSwedishFactory().all;

// Passive verb form regexes per language
const indonesianPassiveRegex = [ /^(di)\S+($|[ \n\r\t.,'()"+\-;!?:/»«‹›<>])/ig ];

/**
 * Returns words that have been determined to be a passive through a regex.
 *
 * @param {string} sentence  The sentence to check.
 * @param {array} regexes    The regexes to match.
 *
 * @returns {Array}          A list with the matches.
 */
const matchPassiveVerbsWithRegexes = function( sentence, regexes ) {
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
