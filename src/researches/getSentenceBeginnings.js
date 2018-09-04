import getWords from "../stringProcessing/getWords.js";
import stripSpaces from "../stringProcessing/stripSpaces.js";
import { stripFullTags as stripTags } from "../stringProcessing/stripHTMLTags.js";
import getFirstWordExceptions from "../helpers/getFirstWordExceptions.js";

import { isEmpty } from "lodash-es";
import { forEach } from "lodash-es";
import { filter } from "lodash-es";

/**
 * Compares the first word of each sentence with the first word of the following sentence.
 *
 * @param {string} currentSentenceBeginning The first word of the current sentence.
 * @param {string} nextSentenceBeginning The first word of the next sentence.
 * @returns {boolean} Returns true if sentence beginnings match.
 */
let startsWithSameWord = function( currentSentenceBeginning, nextSentenceBeginning ) {
	if ( ! isEmpty( currentSentenceBeginning ) && currentSentenceBeginning === nextSentenceBeginning ) {
		return true;
	}

	return false;
};

/**
 * Counts the number of similar sentence beginnings.
 *
 * @param {Array} sentenceBeginnings The array containing the first word of each sentence.
 * @param {Array} sentences The array containing all sentences.
 * @returns {Array} The array containing the objects containing the first words and the corresponding counts.
 */
let compareFirstWords = function( sentenceBeginnings, sentences ) {
	let consecutiveFirstWords = [];
	let foundSentences = [];
	let sameBeginnings = 1;

	forEach( sentenceBeginnings, function( beginning, i ) {
		let currentSentenceBeginning = beginning;
		let nextSentenceBeginning = sentenceBeginnings[ i + 1 ];
		foundSentences.push( sentences[ i ] );

		if ( startsWithSameWord( currentSentenceBeginning, nextSentenceBeginning ) ) {
			sameBeginnings++;
		} else {
			consecutiveFirstWords.push( { word: currentSentenceBeginning, count: sameBeginnings, sentences: foundSentences } );
			sameBeginnings = 1;
			foundSentences = [];
		}
	} );

	return consecutiveFirstWords;
};

/**
 * Sanitizes the sentence.
 *
 * @param {string} sentence The sentence to sanitize.
 * @returns {string} The sanitized sentence.
 */
function sanitizeSentence( sentence ) {
	sentence = stripTags( sentence );
	sentence = sentence.replace( /^[^A-Za-zА-Яа-я0-9]/, "" );

	return sentence;
}

/**
 * Retrieves the first word from the sentence.
 *
 * @param {string} sentence The sentence to retrieve the first word from.
 * @param {Array} firstWordExceptions Exceptions to match against.
 * @returns {string} The first word of the sentence.
 */
function getSentenceBeginning( sentence, firstWordExceptions ) {
	sentence = sanitizeSentence( sentence );

	let words = getWords( stripSpaces( sentence ) );

	if ( words.length === 0 ) {
		return "";
	}

	let firstWord = words[ 0 ].toLocaleLowerCase();

	if ( firstWordExceptions.indexOf( firstWord ) > -1 && words.length > 1 ) {
		firstWord += " " + words[ 1 ];
	}

	return firstWord;
}

/**
 * Gets the first word of each sentence from the text, and returns an object containing the first word of each sentence and the corresponding counts.
 *
 * @param {Paper} paper The Paper object to get the text from.
 * @param {Researcher} researcher The researcher this research is a part of.
 * @returns {Object} The object containing the first word of each sentence and the corresponding counts.
 */
export default function( paper, researcher ) {
	let sentences = researcher.getResearch( "sentences" );
	let firstWordExceptions = getFirstWordExceptions( paper.getLocale() )();

	let sentenceBeginnings = sentences.map( function( sentence ) {
		return getSentenceBeginning( sentence, firstWordExceptions );
	} );

	sentences = sentences.filter( function( sentence ) {
		return getWords( stripSpaces( sentence ) ).length > 0;
	} );
	sentenceBeginnings = filter( sentenceBeginnings );

	return compareFirstWords( sentenceBeginnings, sentences );
}


