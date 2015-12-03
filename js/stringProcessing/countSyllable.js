
var cleanTextFunction = require( "../stringProcessing/cleanText.js" );
var basicSyllableFunction = require( "../stringProcessing/basicSyllable.js" );
var advancedSyllableFunction = require( "../stringProcessing/advancedSyllable.js" );
var exclusionSyllableFunction = require( "../stringProcessing/exclusionSyllable.js" );
var removeExlusionWordsFunction = require( "../stringProcessing/advancedSyllable.js" );

/**
 * Counts the number of syllables in a textstring, calls exclusionwordsfunction, basic syllable
 * counter and advanced syllable counter.
 *
 * @param {String} textString The text to count the syllables from.
 * @returns {int} syllable count
 */
module.exports = function( text ){
	var count = 0;
	count += exclusionSyllableFunction( text );

	text = removeExlusionWordsFunction( text );
	text = cleanTextFunction( text );
	text.replace( /[.]/g, " " );


	var subtractSyllablesRegexp = arrayToRegexFunction(
		syllableArray().subtractSyllables,
		true
	);
	var addSyllablesRegexp = arrayToRegexFunction(
		syllableArray().addSyllables,
		true
	);


	count += basicSyllableFunction( text );
	count += advancedSyllableFunction( text, add );
	count -= advancedSyllableFunction( text, subtract );

	return count;
};


YoastSEO.PreProcessor.prototype.basicSyllableCount = function( splitWordArray ) {
	for ( var j = 0; j < splitWordArray.length; j++ ) {
		if ( splitWordArray[ j ].length > 0 ) {
			this.syllableCount++;
		}
	}
};


/**
 * counts the number of syllables in a textstring, calls exclusionwordsfunction, basic syllable
 * counter and advanced syllable counter.
 * @param textString
 * @returns syllable count
 */
YoastSEO.PreProcessor.prototype.syllableCount = function( textString ) {
	this.syllableCount = 0;
	textString = textString.replace( /[.]/g, " " );
	textString = this.removeWords( textString );
	var words = textString.split( " " );
	var subtractSyllablesRegexp = this.stringHelper.stringToRegex(
		YoastSEO.preprocessorConfig.syllables.subtractSyllables,
		true
	);
	var addSyllablesRegexp = this.stringHelper.stringToRegex(
		YoastSEO.preprocessorConfig.syllables.addSyllables,
		true
	);
	for ( var i = 0; i < words.length; i++ ) {
		this.basicSyllableCount( words[ i ].split( /[^aeiouy]/g ) );
		this.advancedSyllableCount( words[ i ], subtractSyllablesRegexp, "subtract" );
		this.advancedSyllableCount( words[ i ], addSyllablesRegexp, "add" );
	}
	return this.syllableCount;
};