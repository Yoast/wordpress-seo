// /*
// /!*
// let Assessor = require( "../../js/assessor.js" );
//  *!/
// let Jed = require( "Jed" );
//
// let forEach = require( "lodash/foreach" );
// let escape = require( "lodash/escape" );
// /!**
//  * binds the renewData function on the change of inputelements.
//  *!/
// let bindEvents = function( app ) {
// 	let elems = [ "content", "locale" ];
// 	for ( let i = 0; i < elems.length; i++ ) {
// 		document.getElementById( elems[ i ] ).addEventListener( "input", app.refresh.bind( app ) );
// 	}
// 	document.getElementById( "locale" ).addEventListener( "input", setLocale.bind( app ) );
// };
//
// let setLocale = function() {
// 	this.config.locale = document.getElementById( "locale" ).value;
// };
//
// let constructI18n = function() {
// 	let translations = {
// 		"domain": "js-text-analysis",
// 		"locale_data": {
// 			"js-text-analysis": {
// 				"": {},
// 			},
// 		},
// 	};
//
// 	return new Jed( translations );
// };
//
// let initializeAssessor = function(  ) {
// 	assessor = new Assessor()
// };
//
// window.onload = function() {
//
//
//
// 	// bindEvents( app );
//
// 	app.refresh();
//
// 	let refreshAnalysis = document.getElementById( "refresh-analysis" );
//
// 	refreshAnalysis.addEventListener( "click", function() {
// 		app.getData();
// 		app.runAnalyzer();
// 	});
// };
//
// require( "console.table" );
// */

let Paper = require( "../../js/values/Paper" );
let relevantWords = require( "../../js/stringProcessing/relevantWords" );
let getRelevantWords = relevantWords.getRelevantWords;
let getWordCombinations = relevantWords.getWordCombinations;
let calculateOccurrences = relevantWords.calculateOccurrences;
let getRelevantCombinations = relevantWords.getRelevantCombinations;
let WordCombination = require( "../../js/values/WordCombination" );
let getWords = require( "../../js/stringProcessing/getWords" );
var template = require( "../../js/templates.js" ).relevantWords;

let map = require( "lodash/map" );
let forEach = require( "lodash/forEach" );

// Binds the renewData function on the change of inputelements.
let bindEvents = function( ) {
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

let outputRelevantWords = function() {
	let foundRelevantWords = calculateRelevantWords();

	document.getElementById( "contentOutput" ).innerHTML = template( {
		words: foundRelevantWords,
	} );
};

window.onload = function() {
	bindEvents();
};
