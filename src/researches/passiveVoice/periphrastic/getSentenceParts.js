const indices = require( "../../../stringProcessing/indices" );
const getIndicesOfList = indices.getIndicesByWordList;
const filterIndices = indices.filterIndices;
const sortIndices = indices.sortIndices;
const stripSpaces = require( "../../../stringProcessing/stripSpaces.js" );
const normalizeSingleQuotes = require( "../../../stringProcessing/quotes.js" ).normalizeSingle;
const arrayToRegex = require( "../../../stringProcessing/createRegexFromArray.js" );
const getWordIndices = require( "./getIndicesWithRegex.js" );
const includesIndex = require( "../../../stringProcessing/includesIndex" );
const followsIndex = require( "../../../stringProcessing/followsIndex" );

const filter = require( "lodash/filter" );
const isUndefined = require( "lodash/isUndefined" );
const includes = require( "lodash/includes" );
const map = require( "lodash/map" );
const forEach = require( "lodash/forEach" );

// English-specific variables and imports.
const SentencePartEnglish = require( "../../english/passiveVoice/SentencePart" );
const auxiliariesEnglish = require( "../../english/passiveVoice/auxiliaries.js" )().all;
const stopwordsEnglish = require( "../../english/passiveVoice/stopwords.js" )();
const stopCharacterRegexEnglish = /([:,]|('ll)|('ve))(?=[ \n\r\t'"+\-»«‹›<>])/ig;
const verbEndingInIngRegex = /\w+ing(?=$|[ \n\r\t.,'()"+\-;!?:/»«‹›<>])/ig;
const ingExclusionArray = [ "king", "cling", "ring", "being", "thing", "something", "anything" ];

// French-specific variables and imports.
const SentencePartFrench = require( "../../french/passiveVoice/SentencePart" );
const auxiliariesFrench = require( "../../french/passiveVoice/auxiliaries.js" )();
const stopwordsFrench = require( "../../french/passiveVoice/stopwords.js" )();
const stopCharacterRegexFrench = /(,)(?=[ \n\r\t'"+\-»«‹›<>])/ig;
const followingAuxiliaryExceptionWordsFrench = [ "le", "la", "les", "une", "l'un", "l'une" ];
const reflexivePronounsFrench = [ "se", "me", "te", "s'y", "m'y", "t'y", "nous nous", "vous vous" ];
const directPrecedenceExceptionRegexFrench = arrayToRegex( reflexivePronounsFrench );
const elisionAuxiliaryExceptionWords = [ "c'", "s'", "peut-" ];
const elisionAuxiliaryExceptionRegex = arrayToRegex( elisionAuxiliaryExceptionWords, true );

// Spanish-specific variables and imports.
const SentencePartSpanish = require( "../../spanish/passiveVoice/SentencePart" );
const auxiliariesSpanish = require( "../../spanish/passiveVoice/auxiliaries.js" )();
const stopwordsSpanish = require( "../../spanish/passiveVoice/stopwords.js" )();
const followingAuxiliaryExceptionWordsSpanish = [ "el", "la", "los", "las", "una" ];

// Italian-specific variables and imports.
const SentencePartItalian = require( "../../italian/passiveVoice/SentencePart" );
const auxiliariesItalian = require( "../../italian/passiveVoice/auxiliaries.js" )();
const stopwordsItalian = require( "../../italian/passiveVoice/stopwords.js" )();
const followingAuxiliaryExceptionWordsItalian = [ "il", "i", "la", "le", "lo", "gli", "uno", "una" ];
const reflexivePronounsItalian = [ "mi", "ti", "si", "ci", "vi" ];
const directPrecedenceExceptionRegexItalian = arrayToRegex( reflexivePronounsItalian );

// Dutch-specific variables and imports.
const SentencePartDutch = require( "../../dutch/passiveVoice/SentencePart" );
const auxiliariesDutch = require( "../../dutch/passiveVoice/auxiliaries.js" )();
const stopwordsDutch = require( "../../dutch/passiveVoice/stopwords.js" )();

/*
 * Variables applying to multiple languages
 * This regex applies to Spanish and Italian
 */
const stopCharacterRegexOthers = /([:,])(?=[ \n\r\t'"+\-»«‹›<>])/ig;


// The language-specific variables used to split sentences into sentence parts.
const languageVariables = {
	en: {
		stopwords: stopwordsEnglish,
		auxiliaryRegex: arrayToRegex( auxiliariesEnglish ),
		SentencePart: SentencePartEnglish,
		auxiliaries: auxiliariesEnglish,
		stopCharacterRegex: stopCharacterRegexEnglish,
	},
	fr: {
		stopwords: stopwordsFrench,
		auxiliaryRegex: arrayToRegex( auxiliariesFrench ),
		SentencePart: SentencePartFrench,
		auxiliaries: auxiliariesFrench,
		stopCharacterRegex: stopCharacterRegexFrench,
		followingAuxiliaryExceptionRegex: arrayToRegex( followingAuxiliaryExceptionWordsFrench ),
		directPrecedenceExceptionRegex: directPrecedenceExceptionRegexFrench,
	},
	es: {
		stopwords: stopwordsSpanish,
		auxiliaryRegex: arrayToRegex( auxiliariesSpanish ),
		SentencePart: SentencePartSpanish,
		auxiliaries: auxiliariesSpanish,
		stopCharacterRegex: stopCharacterRegexOthers,
		followingAuxiliaryExceptionRegex: arrayToRegex( followingAuxiliaryExceptionWordsSpanish ),
	},
	it: {
		stopwords: stopwordsItalian,
		auxiliaryRegex: arrayToRegex( auxiliariesItalian ),
		SentencePart: SentencePartItalian,
		auxiliaries: auxiliariesItalian,
		stopCharacterRegex: stopCharacterRegexOthers,
		followingAuxiliaryExceptionRegex: arrayToRegex( followingAuxiliaryExceptionWordsItalian ),
		directPrecedenceExceptionRegex: directPrecedenceExceptionRegexItalian,
	},
	nl: {
		stopwords: stopwordsDutch,
		auxiliaryRegex: arrayToRegex( auxiliariesDutch ),
		SentencePart: SentencePartDutch,
		auxiliaries: auxiliariesDutch,
	},
};

/**
 * Gets active verbs (ending in ing) to determine sentence breakers in English.
 *
 * @param {string} sentence The sentence to get the active verbs from.
 * @returns {Array} The array with valid matches.
 */
let getVerbsEndingInIng = function( sentence ) {
	// Matches the sentences with words ending in ing.
	let matches = sentence.match( verbEndingInIngRegex ) || [];
	// Filters out words ending in -ing that aren't verbs.
	return filter( matches, function( match ) {
		return ! includes( ingExclusionArray, stripSpaces( match ) );
	} );
};

/**
 * Gets stop characters to determine sentence breakers.
 *
 * @param {string} sentence The sentence to get the stop characters from.
 * @param {string} language The language for which to get the stop characters.
 * @returns {Array} The array with stop characters.
 */
let getStopCharacters = function( sentence, language ) {
	const stopCharacterRegex = languageVariables[ language ].stopCharacterRegex;
	let match;
	let matches = [];

	stopCharacterRegex.lastIndex = 0;

	while ( ( match = stopCharacterRegex.exec( sentence ) ) !== null ) {
		matches.push(
			{
				index: match.index,
				match: match[ 0 ],
			}
		);
	}
	return matches;
};

/**
 * Filters auxiliaries preceded by a reflexive pronoun.
 *
 * @param {string} text The text part in which to check.
 * @param {Array} auxiliaryMatches The auxiliary matches for which to check.
 * @param {string} language The language for which to check auxiliary precedence exceptions.
 *
 * @returns {Array} The filtered list of auxiliary indices.
 */
let auxiliaryPrecedenceExceptionFilter = function( text, auxiliaryMatches, language ) {
	let directPrecedenceExceptionMatches = getWordIndices( text, languageVariables[ language ].directPrecedenceExceptionRegex );

	forEach( auxiliaryMatches, function( auxiliaryMatch ) {
		if ( includesIndex( directPrecedenceExceptionMatches, auxiliaryMatch.index ) ) {
			auxiliaryMatches = auxiliaryMatches.filter( function( auxiliaryObject ) {
				return auxiliaryObject.index !== auxiliaryMatch.index;
			} );
		}
	} );

	return auxiliaryMatches;
};

/**
 * Filters auxiliaries followed by a word on the followingAuxiliaryExceptionWords list.
 *
 * @param {string} text The text part in which to check.
 * @param {Array} auxiliaryMatches The auxiliary matches for which to check.
 * @param {string} language The language for which to filter the auxiliaries.
 * @returns {Array} The filtered list of auxiliary indices.
 */
let followingAuxiliaryExceptionFilter = function( text, auxiliaryMatches, language ) {
	let followingAuxiliaryExceptionRegex = languageVariables[ language ].followingAuxiliaryExceptionRegex;
	let followingAuxiliaryExceptionMatches = getWordIndices( text, followingAuxiliaryExceptionRegex );

	forEach( auxiliaryMatches, function( auxiliaryMatch ) {
		if ( followsIndex( followingAuxiliaryExceptionMatches, auxiliaryMatch ) ) {
			auxiliaryMatches = auxiliaryMatches.filter( function( auxiliaryObject ) {
				return auxiliaryObject.index !== auxiliaryMatch.index;
			} );
		}
	} );

	return auxiliaryMatches;
};

/**
 * Filters auxiliaries preceded by an elided word (e.g., s') on the elisionAuxiliaryExceptionWords list.
 *
 * @param {string} text The text part in which to check.
 * @param {Array} auxiliaryMatches The auxiliary matches for which to check.
 * @returns {Array} The filtered list of auxiliary indices.
 */
let elisionAuxiliaryExceptionFilter = function( text, auxiliaryMatches ) {
	let elisionAuxiliaryExceptionMatches = getWordIndices( text, elisionAuxiliaryExceptionRegex );

	forEach( auxiliaryMatches, function( auxiliaryMatch ) {
		if ( includesIndex( elisionAuxiliaryExceptionMatches, auxiliaryMatch.index, false ) ) {
			auxiliaryMatches = auxiliaryMatches.filter( function( auxiliaryObject ) {
				return auxiliaryObject.index !== auxiliaryMatch.index;
			} );
		}
	} );

	return auxiliaryMatches;
};

/**
 * Gets the indexes of sentence breakers (auxiliaries, stopwords and stop characters;
 * in English also active verbs) to determine sentence parts.
 * Indices are filtered because there could be duplicate matches, like "even though" and "though".
 * In addition, 'having' will be matched both as a -ing verb as well as an auxiliary.
 *
 * @param {string} sentence The sentence to check for indices of sentence breakers.
 * @param {string} language The language for which to match the sentence breakers.
 * @returns {Array} The array with valid indices to use for determining sentence parts.
 */
let getSentenceBreakers = function( sentence, language ) {
	sentence = sentence.toLocaleLowerCase();
	const stopwords = languageVariables[ language ].stopwords;
	const auxiliaries = languageVariables[ language ].auxiliaries;
	let auxiliaryIndices = getIndicesOfList( auxiliaries, sentence );
	let stopwordIndices = getIndicesOfList( stopwords, sentence );
	let indices;
	let stopCharacterIndices;

	// For Dutch we don't use stop characters.
	if ( language !== "nl" ) {
		stopCharacterIndices = getStopCharacters( sentence, language );
	}

	// Concat all indices arrays, filter them and sort them.
	switch( language ) {
		case "fr":
			// Filters auxiliaries matched in the sentence based on a precedence exception filter.
			auxiliaryIndices = auxiliaryPrecedenceExceptionFilter( sentence, auxiliaryIndices, "fr" );
			// Filters auxiliaries matched in the sentence based on a elision exception filter.
			auxiliaryIndices = elisionAuxiliaryExceptionFilter( sentence, auxiliaryIndices );

			indices = [].concat( auxiliaryIndices, stopwordIndices, stopCharacterIndices );
			break;
		case "es":
			indices = [].concat( auxiliaryIndices, stopwordIndices, stopCharacterIndices );
			break;
		case "it":
			// Filters auxiliaries matched in the sentence based on a precedence exception filter.
			auxiliaryIndices = auxiliaryPrecedenceExceptionFilter( sentence, auxiliaryIndices, "it" );
			indices = [].concat( auxiliaryIndices, stopwordIndices, stopCharacterIndices );
			break;
		case "nl":
			indices = [].concat( auxiliaryIndices, stopwordIndices );
			break;
		case "en":
		default:
			var ingVerbs = getVerbsEndingInIng( sentence );
			var ingVerbsIndices = getIndicesOfList( ingVerbs, sentence );
			indices = [].concat( auxiliaryIndices, stopwordIndices, ingVerbsIndices, stopCharacterIndices );
			break;
	}
	indices = filterIndices( indices );
	return sortIndices( indices );
};

/**
 * Gets the auxiliaries from a sentence.
 *
 * @param {string} sentencePart The part of the sentence to match for auxiliaries.
 * @param {string} language The language for which to match the auxiliaries.
 * @returns {Array} All formatted matches from the sentence part.
 */
let getAuxiliaryMatches = function( sentencePart, language ) {
	const auxiliaryRegex = languageVariables[ language ].auxiliaryRegex;
	let auxiliaryMatches = sentencePart.match( auxiliaryRegex ) || [];

	switch( language ) {
		case "fr":
		case "es":
		case "it":
			// An array with the matched auxiliaries and their indices.
			var auxiliaryMatchIndices = getIndicesOfList( auxiliaryMatches, sentencePart );

			if( ( language ===  "fr" ) || ( language === "it" ) ) {
				// Filters auxiliaries matched in the sentence part based on a precedence exception filter.
				auxiliaryMatchIndices = auxiliaryPrecedenceExceptionFilter( sentencePart, auxiliaryMatchIndices, language );
			}
			// Filters auxiliaries matched in the sentence part based on a exception filter for words following the auxiliary.
			auxiliaryMatchIndices = followingAuxiliaryExceptionFilter( sentencePart, auxiliaryMatchIndices, language );

			// An array with the matched auxiliary verbs (without indices).
			var auxiliaryMatchWords = [];

			forEach( auxiliaryMatchIndices, function( auxiliaryMatchIndex ) {
				auxiliaryMatchWords.push( auxiliaryMatchIndex.match );
			} );

			return map( auxiliaryMatchWords, function( auxiliaryMatch ) {
				return stripSpaces( auxiliaryMatch );
			} );
		case "en":
		case "nl":
		default:
			return map( auxiliaryMatches, function( auxiliaryMatch ) {
				return stripSpaces( auxiliaryMatch );
			} );
	}
};

/**
 * Gets the sentence parts from a sentence by determining sentence breakers.
 *
 * @param {string} sentence The sentence to split up in sentence parts.
 * @param {string} language The language for which to get the sentence parts.
 * @returns {Array} The array with all parts of a sentence that have an auxiliary.
 */
let getSentenceParts = function( sentence, language ) {
	let sentenceParts = [];
	const auxiliaryRegex = languageVariables[ language ].auxiliaryRegex;
	let SentencePart = languageVariables[ language ].SentencePart;

	sentence = normalizeSingleQuotes( sentence );

	// First check if there is an auxiliary in the sentence.
	if ( sentence.match( auxiliaryRegex ) === null ) {
		return sentenceParts;
	}

	let indices = getSentenceBreakers( sentence, language );
	// Get the words after the found auxiliary.
	for ( let i = 0; i < indices.length; i++ ) {
		let endIndex = sentence.length;
		if ( ! isUndefined( indices[ i + 1 ] ) ) {
			endIndex = indices[ i + 1 ].index;
		}

		// Cut the sentence from the current index to the endIndex (start of next breaker, of end of sentence).
		let sentencePart = stripSpaces( sentence.substr( indices[ i ].index, endIndex - indices[ i ].index ) );

		let auxiliaryMatches = getAuxiliaryMatches( sentencePart, language );
		// If a sentence part doesn't have an auxiliary, we don't need it, so it can be filtered out.
		if ( auxiliaryMatches.length !== 0 ) {
			sentenceParts.push( new SentencePart( sentencePart, auxiliaryMatches ) );
		}
	}
	return sentenceParts;
};

/**
 * Split the sentence in sentence parts based on auxiliaries.
 *
 * @param {string} sentence The sentence to split in parts.
 * @param {string} language The language for which to get the sentence parts.
 * @returns {Array} A list with sentence parts.
 */
module.exports = function( sentence, language ) {
	return getSentenceParts( sentence, language );
};
