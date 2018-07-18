const forEach = require( "lodash/forEach" );
const isEmpty = require( "lodash/isEmpty" );
const map = require( "lodash/map" );

const arrayToRegex = require( "../../../stringProcessing/createRegexFromArray.js" );
const stripSpaces = require( "../../../stringProcessing/stripSpaces.js" );

// German-specific imports.
const SentencePartGerman = require( "../../german/passiveVoice/SentencePart.js" );
const auxiliariesGerman = require( "../../german/passiveVoice/auxiliaries.js" )().allAuxiliaries;
const stopwordsGerman = require( "../../german/passiveVoice/stopwords.js" )();

// Dutch-specific imports.
const SentencePartDutch = require( "../../dutch/passiveVoice/SentencePart.js" );
const stopwordsDutch = require( "../../dutch/passiveVoice/stopwords.js" )();
const auxiliariesDutch = require( "../../dutch/passiveVoice/auxiliaries.js" )();

// The language-specific variables.
const languageVariables = {
	de: {
		SentencePart: SentencePartGerman,
		stopwordRegex: arrayToRegex( stopwordsGerman ),
		auxiliaryRegex: arrayToRegex( auxiliariesGerman ),
		locale: "de_DE",
	},
	nl: {
		SentencePart: SentencePartDutch,
		stopwordRegex: arrayToRegex( stopwordsDutch ),
		auxiliaryRegex: arrayToRegex( auxiliariesDutch ),
		locale: "nl_NL",
	},
};

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
		const splitSentence = sentence.split( stopword );
		if ( ! isEmpty( splitSentence[ 0 ] ) ) {
			splitSentences.push( splitSentence[ 0 ] );
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
 * @param {string}  language    The language for which to create sentence parts.
 *
 * @returns {Array} The array with sentence parts.
 */
function createSentenceParts( sentences, language ) {
	const auxiliaryRegex = languageVariables[ language ].auxiliaryRegex;
	const SentencePart = languageVariables[ language ].SentencePart;
	const sentenceParts = [];
	forEach( sentences, function( part ) {
		var foundAuxiliaries = sanitizeMatches( part.match( auxiliaryRegex || [] ) );
		sentenceParts.push( new SentencePart( part, foundAuxiliaries, languageVariables[ language ].locale ) );
	} );
	return sentenceParts;
}

/**
 * Splits the sentence into sentence parts based on stopwords.
 *
 * @param {string} sentence The text to split into sentence parts.
 * @param {string} language The language for which to split sentences.
 *
 * @returns {Array} The array with sentence parts.
 */
function splitSentence( sentence, language ) {
	const stopwordRegex = languageVariables[ language ].stopwordRegex;
	const stopwords = sentence.match( stopwordRegex ) || [];
	const splitSentences = splitOnWords( sentence, stopwords );
	return createSentenceParts( splitSentences, language );
}

/**
 * Splits up the sentence in parts based on stopwords.
 *
 * @param {string} sentence The sentence to split up in parts.
 * @param {string} language The language for which to split sentences into parts.
 * @returns {Array} The array with the sentence parts.
 */
module.exports = function( sentence, language ) {
	return splitSentence( sentence, language );
};

