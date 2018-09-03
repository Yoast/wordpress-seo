let Paper = require( "../../src/values/Paper" );
let relevantWords = require( "../../src/stringProcessing/relevantWords" );
let getRelevantWords = relevantWords.getRelevantWords;
let getWordCombinations = relevantWords.getWordCombinations;
let calculateOccurrences = relevantWords.calculateOccurrences;
let getRelevantCombinations = relevantWords.getRelevantCombinations;
let WordCombination = require( "../../src/values/WordCombination" );
let getWords = require( "../../src/stringProcessing/getWords" );
let template = require( "../../src/templates.js" ).relevantWords;

import { map } from "lodash-es";
import { forEach } from "lodash-es";


/**
 * Binds the renewData function on the change of input elements.
 *
 * @returns {void}
 */
let bindEvents = function() {
	let elems = [ "content", "locale" ];
	for ( let i = 0; i < elems.length; i++ ) {
		document.getElementById( elems[ i ] ).addEventListener( "input", outputRelevantWords );
	}
};

/**
 * Rounds number to four decimals.
 *
 * @param {number} number The number to be rounded.
 * @returns {number} The rounded number.
 */
let formatNumber = function ( number ) {

	if ( Math.round( number ) === number ) {
		return number;
	}

	return Math.round( number * 10000 ) / 10000;
};

/**
 * Calculates all properties for the relevant word objects.
 *
 * @returns {object} The relevant word objects.
 */
let calculateRelevantWords = function () {
	let locale = document.getElementById( "locale" ).value || "en_US";
	let text = document.getElementById( "content" ).value;
	return map( getRelevantWords( text, locale ), function( word ) {
		let words = getWords( text );

		let output = {
			"word": word.getCombination(),
			"relevance": formatNumber( word.getRelevance() ),
			"length": word._length,
			"occurrences": word.getOccurrences(),
			"multiplier":  formatNumber( word.getMultiplier( word.getRelevantWordPercentage() ) ),
			"relevantWordPercentage": formatNumber( word.getRelevantWordPercentage() ),
		};

		if ( word._length === 1 ) {
			output[ "lengthBonus" ] = "";
		} else {
			output[ "lengthBonus" ] = WordCombination.lengthBonus[ word._length ];
		}

		output[ "density" ] = formatNumber( word.getDensity( words.length ) );
		return output;

	} );
};

/**
 * Renders the relevant words table.
 *
 * @returns {void}
 */
let outputRelevantWords = function() {
	let foundRelevantWords = calculateRelevantWords();

	document.getElementById( "contentOutput" ).innerHTML = template( {
		words: foundRelevantWords,
	} );
};

/**
 * Executes the bindEvents function on load.
 *
 * @returns {void}
 */
window.onload = function() {
	bindEvents();
};
