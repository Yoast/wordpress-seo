import { forEach } from "lodash-es";
import { isEmpty } from "lodash-es";
import { map } from "lodash-es";

import stripSpaces from "../../sanitize/stripSpaces.js";

/**
 * Strips spaces from the auxiliary matches.
 *
 * @param {Array} matches A list with matches of auxiliaries.
 * @returns {Array} A list with matches with spaces removed.
 */
function sanitizeMatches( matches ) {
	return map( matches, function( match ) {
		return stripSpaces( match );
	} );
}

/**
 * Splits sentences into sentence parts based on stopwords.
 *
 * @param {string} sentence The sentence to split.
 * @param {Array} stopwords The array with matched stopwords.
 * @returns {Array} The array with sentence parts.
 */
function splitOnWords( sentence, stopwords ) {
	const splitSentences = [];

	// Split the sentence on each found stopword and push this part in an array.
	forEach( stopwords, function( stopword ) {
		const sentenceSplit = sentence.split( stopword );
		if ( ! isEmpty( sentenceSplit[ 0 ] ) ) {
			splitSentences.push( sentenceSplit[ 0 ] );
		}
		const startIndex = sentence.indexOf( stopword );
		const endIndex = sentence.length;
		sentence = stripSpaces( sentence.substr( startIndex, endIndex ) );
	} );

	// Push the remainder of the sentence in the sentence parts array.
	splitSentences.push( sentence );
	return splitSentences;
}

/**
 * Creates sentence parts based on split sentences.

 * @param {Array}   sentences   The array with split sentences.
 * @param {Object}  options    The language for which to create sentence parts.
 *
 * @returns {Array} The array with sentence parts.
 */
function createSentenceParts( sentences, options ) {
	const sentenceParts = [];
	forEach( sentences, function( part ) {
		const foundAuxiliaries = sanitizeMatches( part.match( options.regexes.auxiliaryRegex || [] ) );
		sentenceParts.push( new options.SentencePart( part, foundAuxiliaries, options.locale ) );
	} );
	return sentenceParts;
}

/**
 * Splits the sentence into sentence parts based on stopwords.
 *
 * @param {string} sentence The text to split into sentence parts.
 * @param {Object} options The language for which to split sentences.
 *
 * @returns {Array} The array with sentence parts.
 */
function splitSentence( sentence, options ) {
	const stopwords = sentence.match( options.regexes.stopwordRegex ) || [];
	const splitSentences = splitOnWords( sentence, stopwords );
	return createSentenceParts( splitSentences, options );
}

export default splitSentence;
