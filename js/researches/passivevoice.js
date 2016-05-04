var getSentences = require( "../stringProcessing/getSentences.js" );
var arrayToRegex = require( "../stringProcessing/createRegexFromArray.js" );
var cleanText = require( "../stringProcessing/cleanText.js" );
var stringToRegex = require( "../stringProcessing/stringToRegex.js" );

var verbEndingEd = require( "../language/en_US/verb-ending-ed.js" )();
var verbEndingIng = require( "../language/en_US/verb-ending-ing.js" )();
var auxiliaries = require( "../language/en_us/auxiliaries.js" )();
var irregulars = require( "../language/en_us/irregulars.js" )();
var auxiliariesExceptions = require( "../language/en_us/auxiliariesExceptions.js" )();
var filter = require( "lodash/filter");
var isUndefined = require( "lodash/isUndefined" );
var isEmpty = require( "lodash/isEmpty" );


/*
var matchSubSentence = function( subSentence ){
	subSentence = subSentence + ".";
	console.log( subSentence );
	var ingMatches = subSentence.match( ingWordRegex );
	console.log( ingMatches );
	if (ingMatches ){}
	//var matches = subSentence.match( edWordRegex );

};
*/
var auxiliaryRegex = arrayToRegex( auxiliaries );

/**
 * Matches sentence on auxiliary words.
 * @param sentence
 */
var matchAuxiliary = function( sentence ) {
	var matches = auxiliaries;
	var matchedParts = [];
	matches.map( function( part ){

		// search for each part in the auxiliaries array and filter on index -1
		var index = sentence.search( stringToRegex( part ) );
		if( index > -1 ){
			matchedParts.push(
				{
					index: index,
					match: part
				}
			)
		}
	} );
	return matchedParts;
};

var matchIrregular = function( sentence ) {
	var matches = irregulars;

};

var matchVerbs = function( sentence ){

};



module.exports = function( paper) {
	var text = paper.getText();
	var sentences = getSentences( text );
	//var verb_edRegex = arrayToRegex( verbEndingEd );


	// Matches all words ending in ED or ING.

	var possibleMatches = [];


	var passiveCount = 0;


	sentences.map( function( sentence ) {

		// First check if there is an auxiliary word in the sentence
		if( sentence.match( auxiliaryRegex ) !== null ) {

			// Get the index of the Auxiliary
			var indices = matchAuxiliary( sentence );
			var subSentences = [];
			var curIndex = 0;

			// Get the words after the found auxiliary
			for( var i = 0; i < indices.length; i++ ){
				var endIndex = sentence.length;
				if( typeof( indices[ i + 1] ) !== "undefined" ){
					endIndex = indices[ i + 1 ].match.length
				}
				var subSentence = sentence.substr( curIndex, endIndex );
				curIndex = endIndex;
				subSentences.push( subSentences );
			}
		}
	} );
/*
	possibleMatches.map( function( sentence ) {
		matchAuxiliary( sentence );
	} );
*/
	//split op aux, dan match op -ed, match -ed in nonverb-ed list
	// stoppen op andere aux of stopword
	//
/*
	possibleMatches.map( function( sentence ) {
		// todo needs proper regex.
		var parts = sentence.split( auxiliaryRegex );
		parts.shift();
		parts = parts.filter( function( part ) {
			return ! isUndefined( part ) && part !== " ";
		} );
		console.log( parts );

		parts = parts.filter( function( part ) {
			var matches = part.match( auxiliaryRegex) || [];
			matches.filter( function( match ){
				return auxiliariesExceptions.indexOf( match ) > -1;
			} );
			return matches.length > 0;
		} );

		console.log( parts );

		if( parts.length > 0 ) {
			parts.map( function( subSentence ){
				matchSubSentence( subSentence );
			} );
		}
	} );
	return passiveCount;
	*/
};
