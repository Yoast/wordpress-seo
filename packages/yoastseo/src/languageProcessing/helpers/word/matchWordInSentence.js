import wordBoundariesFactory from "../../../config/wordBoundaries.js";
const wordBoundaries = wordBoundariesFactory();
import { escapeRegExp, includes } from "lodash-es";
import addWordBoundary from "./addWordboundary.js";

/**
 * Checks whether a character is present in the list of word boundaries.
 *
 * @param {string} character The character to look for.
 * @returns {boolean} Whether or not the character is present in the list of word boundaries.
 */
const characterInBoundary = function( character ) {
	return includes( wordBoundaries, character );
};

/**
 * Checks whether a word is present in a sentence.
 *
 * @param {string} word The word to search for in the sentence.
 * @param {string} sentence The sentence to look through.
 * @returns {boolean} Whether or not the word is present in the sentence.
 */
const isWordInSentence = function( word, sentence ) {
	// To ensure proper matching, make everything lowercase.
	word = word.toLocaleLowerCase();
	sentence = sentence.toLocaleLowerCase();

	// Escape regex in word, since we use regex characters like in abbreviations ("e.g.").
	const wordWithBoundaries = addWordBoundary( escapeRegExp( word ) );
	let occurrenceStart = sentence.search( new RegExp( wordWithBoundaries, "ig" ) );
	// Return false if no match has been found.
	if ( occurrenceStart === -1 ) {
		return false;
	}
	/*
	If there is a word boundary before the matched word, the regex includes this word boundary in the match.
	This means that occurrenceStart is the index of the word boundary before the match. Therefore 1 has to
	be added to occurrenceStart, except when there is no word boundary before the match (i.e. at the start
	of a sentence).
	 */
	if ( occurrenceStart > 0 ) {
		occurrenceStart += 1;
	}
	const occurrenceEnd = occurrenceStart + word.length;

	// Check if the previous and next character are word boundaries to determine if a complete word was detected
	const previousCharacter = characterInBoundary( sentence[ occurrenceStart - 1 ] ) || occurrenceStart === 0;
	const nextCharacter = characterInBoundary( sentence[ occurrenceEnd ] ) || occurrenceEnd === sentence.length;

	return ( ( previousCharacter ) && ( nextCharacter ) );
};

export {
	characterInBoundary,
	isWordInSentence,
};

export default {
	characterInBoundary,
	isWordInSentence,
};
