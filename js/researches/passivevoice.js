var getSentences = require( "../stringProcessing/getSentences.js" );
var arrayToRegex = require( "../stringProcessing/createRegexFromArray.js" );
var cleanText = require( "../stringProcessing/cleanText.js" );

var verbEndingEd = require( "../language/en_US/verb-ending-ed.js" )();
var verbEndingIng = require( "../language/en_US/verb-ending-ing.js" )();
var auxiliaries = require( "../language/en_us/auxiliaries.js" )();

var filter = require( "lodash/filter");
var isUndefined = require( "lodash/isUndefined" );
var isEmpty = require( "lodash/isEmpty" );

var edWordRegex = new RegExp( "([a-z]+)ed[ \n\r\t\.,'\(\)\"\+\-;!?:\/»«‹›<>]", "ig" );
var ingWordRegex = new RegExp( "([a-z]+)ing[ \s\n\r\t\.,'\(\)\"\+\-;!?:\/»«‹›<>]", "i" );

var matchSubSentence = function( subSentence ){
	subSentence = subSentence + ".";
	console.log( subSentence );
	var ingMatches = subSentence.match( ingWordRegex );
	console.log( ingMatches );
	if (ingMatches ){}
	//var matches = subSentence.match( edWordRegex );

};

module.exports = function( paper) {
	var text = paper.getText();
	var sentences = getSentences( text );
	//var verb_edRegex = arrayToRegex( verbEndingEd );

	var auxiliaryRegex = arrayToRegex( auxiliaries );

	// Matches all words ending in ED or ING.


	var possibleMatches = [];
	var matches;
	var passiveCount = 0;

	// First check if there is an auxiliary word in the sentence
	sentences.map( function( sentence ) {
		if( sentence.match( auxiliaryRegex ) !== null ) {
			possibleMatches.push( sentence );
		}
	} );

	//split op aux, dan match op -ed, match -ed in nonverb-ed list
	// stoppen op andere aux of stopword
	//

	possibleMatches.map( function( sentence ) {
		// todo needs proper regex.
		var parts = sentence.split( auxiliaryRegex );
		parts.shift();
		parts = parts.filter( function( part ) {
			return ! isUndefined( part ) && part !== " ";
		} );

		parts = parts.filter( function( part ) {
			return part.match( auxiliaryRegex) === null
		} );

		if( parts.length > 0 ) {
			parts.map( function( subSentence ){
				matchSubSentence( subSentence );
			} );
		}
	} );
	return passiveCount;
};
