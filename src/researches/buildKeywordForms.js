const getFormsForLanguage = require( "../helpers/getFormsForLanguage.js" )();
const getWords = require( "../stringProcessing/getWords.js" );
const getLanguage = require( "../helpers/getLanguage.js" );
const getFunctionWords = require( "../helpers/getFunctionWords.js" )();
const parseSynonyms = require( "../stringProcessing/parseSynonyms" );
import { getVariationsApostrophe } from "../stringProcessing/getVariationsApostrophe";
import { getVariationsApostropheInArray } from "../stringProcessing/getVariationsApostrophe";

const includes = require( "lodash/includes" );
const filter = require( "lodash/filter" );
const isUndefined = require( "lodash/isUndefined" );
const escapeRegExp = require( "lodash/escapeRegExp" );
const unique = require( "lodash/uniq" );
const flatten = require( "lodash/flatten" );

/**
 * Filters function words from an array of words based on the language.
 *
 * @param {Array} array The words to check.
 * @param {string} language The language to take function words for.
 *
 * @returns {Array} The original array with the function words filtered out.
 */
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
 * If morphology is required the module builds all word forms for all words (if no function words list available) or
 * for all content words (i.e., excluding prepositions, articles, conjunctions, if the function words list is available).
 *
 * @param {string} keyphrase The keyphrase of the paper (or a synonym phrase) to get forms for.
 * @param {string} language The language to use for morphological analyzer and for function words.
 * @param {Object} morphologyData The available morphology data per language (false if unavailable).
 *
 * @returns {Array} Array of all forms to be searched for keyword-based assessments.
 */
const buildForms = function( keyphrase, language, morphologyData ) {
	if ( isUndefined( keyphrase ) || keyphrase === "" ) {
		return [];
	}

	/*
	 * If the keyphrase is embedded in double quotation marks, return keyword itself, without outer-most quotation marks.
	 * Additionally, provide apostrophe variations.
	 */

	const doubleQuotes = [ "“", "”", "〝", "〞", "〟", "‟", "„", "\"" ];
	if ( includes( doubleQuotes, keyphrase[ 0 ] ) && includes( doubleQuotes, keyphrase[ keyphrase.length - 1 ] ) ) {
		keyphrase = keyphrase.substring( 1, keyphrase.length - 1 );
		return [ unique( [].concat( keyphrase, getVariationsApostrophe( keyphrase ) ) ) ];
	}

	const words = filterFunctionWords( getWords( keyphrase ), language );

	let forms = [];

	const getForms = getFormsForLanguage[ language ];
	/*
	 * Only returns the keyword and the keyword with apostrophe variations if morphological forms cannot be built.
	 * Otherwise additionally returns the morphological forms.
	 */
	if ( morphologyData === false || isUndefined( getForms ) ) {
		words.forEach( function( word ) {
			const wordToLowerCase = escapeRegExp( word.toLocaleLowerCase() );

			forms.push( unique( [].concat( wordToLowerCase, getVariationsApostrophe( wordToLowerCase ) ) ) );
		} );
	} else {
		words.forEach( function( word ) {
			const wordToLowerCase = escapeRegExp( word.toLocaleLowerCase() );
			const formsOfThisWord = getForms( wordToLowerCase, morphologyData );
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
 * @param {string} language The paper's language.
 * @param {Object} morphologyData The available morphology data to be used by the getForms function (language specific).
 *
 * @returns {Object} Object with an array of keyphrase forms and an array of arrays of synonyms forms.
 */
const collectForms = function( keyphrase, synonyms, language = "en", morphologyData ) {
	const synonymsSplit = parseSynonyms( synonyms );

	let keyphraseForms = buildForms( keyphrase, language, morphologyData );
	let synonymsForms = synonymsSplit.map( synonym => buildForms( synonym, language, morphologyData ) );

	return {
		keyphraseForms: keyphraseForms,
		synonymsForms: synonymsForms,
	};
};

/**
 * Calls the function that builds keyphrase and synonyms forms for a specific research data.
 *
 * @param {Paper} paper The paper to build keyphrase and synonym forms for.
 * @param {Researcher} researcher The researcher prototype.
 *
 * @returns {Object} Object with an array of keyphrase forms and an array of arrays of synonyms forms.
 */
function research( paper, researcher ) {
	// TODO: include functionality for language-specific imports
	const language = getLanguage( paper.getLocale() );

	const morphologyData = researcher.getProvidedData( "morphology" );
	return collectForms( paper.getKeyword(), paper.getSynonyms(), language, morphologyData );
}

module.exports = {
	filterFunctionWords: filterFunctionWords,
	buildForms: buildForms,
	collectForms: collectForms,
	research: research,
};
