const getFormsForLanguage = require( "../helpers/getFormsForLanguage.js" )();
const getWords = require( "../stringProcessing/getWords.js" );
const getLanguage = require( "../helpers/getLanguage.js" );
const getFunctionWords = require( "../helpers/getFunctionWords.js" )();
const parseSynonyms = require( "../stringProcessing/parseSynonyms" );
import { getVariationsApostrophe } from "../stringProcessing/getVariationsApostrophe";
import { getVariationsApostropheInArray } from "../stringProcessing/getVariationsApostrophe";

import { includes } from "lodash-es";
import { filter } from "lodash-es";
import { isUndefined } from "lodash-es";
import { escapeRegExp } from "lodash-es";
import { uniq as unique } from "lodash-es";
import { flatten } from "lodash-es";
import { get } from "lodash-es";
import { memoize } from "lodash-es";

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

	const functionWords = get( getFunctionWords, [ language ], [] );

	if ( array.length > 1 ) {
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
const collectKeyphraseAndSynonymsForms = function( keyphrase, synonyms, language = "en", morphologyData ) {
	const synonymsSplit = parseSynonyms( synonyms );

	let keyphraseForms = buildForms( keyphrase, language, morphologyData );
	let synonymsForms = synonymsSplit.map( synonym => buildForms( synonym, language, morphologyData ) );

	return {
		keyphraseForms: keyphraseForms,
		synonymsForms: synonymsForms,
	};
};

/**
 * Cashes morphological forms depending on the currently available morphologyData and (separately) keyphrase, synonyms,
 * and language. In this way, if the morphologyData remains the same in multiple calls of this function, the function
 * that collects actual morphological forms only needs to check if the keyphrase, synonyms and language also remain the
 * same to return the cashed result. The joining of keyphrase, synonyms and language for this function is needed,
 * because by default memoize cashes by the first key only, which in the current case would mean that the function would
 * return the cashed forms if the keyphrase has not changed (without checking if synonyms and language were changed).
 *
 * @param {Object|boolean} morphologyData The available morphology data.
 *
 * @returns {function} The function that collects the forms for a given set of keyphrase, synonyms, language and
 * morphologyData.
 */
const primeMorphologyData = memoize( ( morphologyData ) => {
	return memoize( ( keyphrase, synonyms, language = "en" ) => {
		return collectKeyphraseAndSynonymsForms( keyphrase, synonyms, language, morphologyData );
	}, ( keyphrase, synonyms, language ) => {
		return keyphrase + "," + synonyms + "," + language;
	} );
} );


/**
 * Retrieves morphological forms of words of the keyphrase and of each synonym phrase using the function that cashes
 * the results of previous calls of this function.
 *
 * @param {string} keyphrase The paper's keyphrase.
 * @param {string} synonyms The paper's synonyms.
 * @param {string} language The paper's language.
 * @param {Object} morphologyData The available morphology data to be used by the getForms function (language specific).
 *
 * @returns {Object} Object with an array of keyphrase forms and an array of arrays of synonyms forms.
 */
function collectForms( keyphrase, synonyms, language = "en", morphologyData ) {
	const collectFormsWithMorphologyData = primeMorphologyData( morphologyData );

	return collectFormsWithMorphologyData( keyphrase, synonyms, language );
}

/**
 * Calls the function that builds keyphrase and synonyms forms for a specific research data.
 *
 * @param {Paper} paper The paper to build keyphrase and synonym forms for.
 * @param {Researcher} researcher The researcher prototype.
 *
 * @returns {Object} Object with an array of keyphrase forms and an array of arrays of synonyms forms.
 */
function research( paper, researcher ) {
	const language = getLanguage( paper.getLocale() );

	const morphologyData = get( researcher.getProvidedData( "morphology" ), [ language ], false );

	return collectForms( paper.getKeyword(), paper.getSynonyms(), language, morphologyData );
}

module.exports = {
	filterFunctionWords: filterFunctionWords,
	buildForms: buildForms,
	collectForms: collectForms,
	research: research,
};
