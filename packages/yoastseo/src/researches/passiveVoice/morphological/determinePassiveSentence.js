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
 * Checks the passed sentences to see if they contain passive verb-forms.
 *
 * @param {string} sentence The sentence to match against.
 * @param {string} language The language of the text.
 * @returns {Array} The list of encountered passive verbs.
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

const determineSentenceIsPassiveIndonesian = function( sentence ) {
	const words = getWords( sentence );
	let matchedPassives = words.filter( word => ( word.startsWith( passivePrefixIndonesian ) ) );

	// Check exception list.
	if ( matchedPassives.length === 0 ) {
		return false;
	}
	matchedPassives = matchedPassives.filter( matchedPassive => ( ! nonPassivesIndonesian.includes( matchedPassive ) ) );

	// Check direct precedence exceptions.
	if ( matchedPassives.length === 0 ) {
		return false;
	}
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

	if ( [ "id" ].includes( language ) ) {
		return determineSentenceIsPassiveIndonesian( sentenceText, language );
	}
}
