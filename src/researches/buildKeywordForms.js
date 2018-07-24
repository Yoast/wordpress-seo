const getFormsForLanguage = require( "../helpers/getFormsForLanguage.js" )();
const getWords = require( "../stringProcessing/getWords.js" );
const getLanguage = require( "../helpers/getLanguage.js" );
const getFunctionWords = require( "../helpers/getFunctionWords.js" )();
const parseSynonyms = require( "../stringProcessing/parseSynonyms" );

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

const filterFunctionWords = function( array, language ) {
	if ( isUndefined( language ) || language === "" ) {
		language = "en";
	}

	const functionWords = getFunctionWords[ language ];

	if ( array.length > 1 && ! ( isUndefined( functionWords ) ) ) {
		const arrayFiltered = filter( array, function( word ) {
			return ( ! includes( functionWords.all, word.trim().toLocaleLowerCase() ) );
		} );

		if ( arrayFiltered.length > 0 ) {
			return arrayFiltered;
		}
	}

	return array;
};

/**
 * Analyzes the focus keyword string. Checks if morphology is requested or if the user wants to match exact string.
 * If morphology is required the module builds all word forms for all content words (prepositions, articles, conjunctions).
 *
 * @param {string} keyphrase The keyphrase of the paper (or a synonym phrase) to get forms for.
 * @param {string} language The language to use for morphological analyzer and for function words.
 * @param {boolean} morphologyRequired Whether the morphological analysis is required (i.e, Premium vs. Free).
 *
 * @returns {Array} Array of all forms to be searched for keyword-based assessments.
 */
const buildForms = function( keyphrase, language, morphologyRequired = false ) {
	if ( isUndefined( keyphrase ) || keyphrase === "" ) {
		return [];
	}

	// If the keyphrase is embedded in double quotation marks, return keyword itself, without outer-most quotation marks.
	const doubleQuotes = [ "“", "”", "〝", "〞", "〟", "‟", "„", "\"" ];
	if ( includes( doubleQuotes, keyphrase[ 0 ] ) && includes( doubleQuotes, keyphrase[ keyphrase.length - 1 ] ) ) {
		keyphrase = keyphrase.substring( 1, keyphrase.length - 1 );
		return [ unique( [].concat( keyphrase, getVariationsApostrophe( keyphrase ) ) ) ];
	}

	const words = filterFunctionWords( getWords( keyphrase ), language );

	const getForms = getFormsForLanguage[ language ];
	let forms = [];

	if ( morphologyRequired === false || isUndefined( getForms ) ) {
		words.forEach( function( word ) {
			const wordToLowerCase = escapeRegExp( word.toLocaleLowerCase() );

			forms.push( unique( [].concat( wordToLowerCase, getVariationsApostrophe( wordToLowerCase ) ) ) );
		} );
	} else {
		words.forEach( function( word ) {
			const wordToLowerCase = escapeRegExp( word.toLocaleLowerCase() );
			const formsOfThisWord = unique( getForms( wordToLowerCase ) );
			const variationsApostrophes = getVariationsApostropheInArray( formsOfThisWord );
			forms.push( unique( flatten( formsOfThisWord.concat( variationsApostrophes ) ) ).filter( Boolean ) );
		} );
	}

	return forms;
};

/**
 * Builds morphological forms of words of the keyphrase and of each synonym phrase.
 *
 * @param {string} keyphrase The paper's keyphrase.
 * @param {string} synonyms The paper's synonyms.
 * @param {string} locale The paper's locale.
 * @param {boolean} morphologyRequired Whether the morphological analysis is required (i.e, Premium vs. Free).
 *
 * @returns {Object} Object with an array of keyphrase forms and an array of arrays of synonyms forms.
 */
const collectForms = function( keyphrase, synonyms, locale = "en_EN", morphologyRequired ) {
	const synonymsSplit = parseSynonyms( synonyms );
	const language = getLanguage( locale );
	let keyphraseForms = buildForms( keyphrase, language, morphologyRequired );

	let synonymsForms = synonymsSplit.map( synonym => buildForms( synonym, language, morphologyRequired ) );

	return {
		keyphraseForms: keyphraseForms,
		synonymsForms: synonymsForms,
	};
};


module.exports = {
	filterFunctionWords: filterFunctionWords,
	buildForms: buildForms,
	collectForms: collectForms,
};
