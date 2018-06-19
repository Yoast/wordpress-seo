const getFormsForLanguage = require( "../helpers/getFormsForLanguage.js" )();
const getWords = require( "../stringProcessing/getWords.js" );
const getLanguage = require( "../helpers/getLanguage.js" );
const getFunctionWords = require( "../helpers/getFunctionWords.js" )();

const includes = require( "lodash/includes" );
const filter = require( "lodash/filter" );
const isUndefined = require( "lodash/isUndefined" );
const escapeRegExp = require( "lodash/escapeRegExp" );
const unique = require( "lodash/uniq" );
const flatten = require( "lodash/flatten" );

/**
 * Checks if the input word contains a normalized or a non-normalized apostrophe.
 * If so generates a complementary form (e.g., "il'y a" > "il’a")
 *
 * @param {string} word The word to check.
 *
 * @returns {Array} All possible variations of the input word.
 */
const getVariationsApostrophe = function( word ) {
	const apostrophes = [ "'", "‘", "’", "‛", "`" ];

	return unique( flatten( [].concat( apostrophes.map( function( apostropheOuter ) {
		return [].concat( apostrophes.map( function( apostropheInner ) {
			return word.replace( apostropheOuter, apostropheInner );
		} ) );
	} ) ) ) );
};

/**
 * Applies getVariationsApostrophe to an array of strings
 *
 * @param {Array} forms The word to check.
 *
 * @returns {Array} Original array with normalized and non-normalized apostrophes switched.
 */
const getVariationsApostropheInArray = function( forms ) {
	return [].concat( forms.map( function( form ) {
		return ( getVariationsApostrophe( form ) );
	} ) ).filter( Boolean );
};

/**
 * Analyzes the focus keyword string. Checks if morphology is requested or if the user wants to match exact string.
 * If morphology is required the module builds all word forms for all content words (prepositions, articles, conjunctions).
 *
 * @param {Object} paper The paper to analyze keyword forms for.
 *
 * @returns {Array} Array of all forms to be searched for keyword-based assessments.
 */
module.exports = function( paper ) {
	let keyword = paper.getKeyword();
	const language = getLanguage( paper.getLocale() );
	const getForms = getFormsForLanguage[ language ];

	/*
	 * If the language is not yet supported with respect to morphological analysis, return keyword itself,
	 * including variations of the apostrophe in case it is present.
	 */
	if ( isUndefined( getForms ) ) {
		return unique( [].concat( keyword, getVariationsApostrophe( keyword ) ) );
	}

	const doubleQuotes = [ "“", "”", "〝", "〞", "〟", "‟", "„", "\"" ];
	// If the keyword is embedded in double quotation marks, return keyword itself, without outer-most quotation marks.
	if ( includes( doubleQuotes, keyword[ 0 ] ) && includes( doubleQuotes, keyword[ keyword.length - 1 ] ) ) {
		keyword = keyword.substring( 1, keyword.length - 1 );
		return unique( [].concat( keyword, getVariationsApostrophe( keyword ) ) );
	}

	let forms = [];

	// If the keyword is a single word return all its possible forms.
	if ( keyword.indexOf( " " ) === -1 ) {
		const wordToLowerCase = escapeRegExp( keyword.toLocaleLowerCase() );
		forms = flatten( forms.concat( getForms( wordToLowerCase ) ) );
		forms = unique( flatten( forms.concat( getVariationsApostropheInArray( forms ) ) ) );
		return forms;
	}

	// If the keyword contains multiple words first filter all function words out, then build all possible forms for remaining contents words.
	const keyWords = getWords( keyword );
	const functionWords = getFunctionWords[ language ].all;

	const keyWordsFiltered = filter( keyWords, function( word ) {
		return ( ! includes( functionWords, word.trim().toLocaleLowerCase() ) );
	} );

	// If after filtering there is nothing left, return all forms of all words, because apparently we were too harsh with filtering.
	if ( keyWordsFiltered.length === 0 ) {
		keyWords.forEach( function( word ) {
			const wordToLowerCase = escapeRegExp( word.toLocaleLowerCase() );
			forms = flatten( forms.concat( getForms( wordToLowerCase ) ) );
			forms = unique( flatten( forms.concat( getVariationsApostropheInArray( forms ) ) ) );
		} );
		return forms;
	}

	// If after filtering function words out there are still words remaining, build all forms for each of them and return in one array.
	keyWordsFiltered.forEach( function( word ) {
		const wordToLowerCase = escapeRegExp( word.toLocaleLowerCase() );
		forms = flatten( forms.concat( getForms( wordToLowerCase ) ) );
		forms = unique( flatten( forms.concat( getVariationsApostropheInArray( forms ) ) ) );
	} );
	return forms;
};
