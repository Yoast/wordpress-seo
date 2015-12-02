var arrayToRegexFunction = require( "../stringProcessing/arrayToRegex.js" );
var syllableArray = require( "../config/syllables.js" );

/**
 *
 * @param text
 * @param regex
 * @returns {number}
 */
module.exports = function( text, operator ){
	var regex, matches, count = 0, array = text.split( " " );
	switch(operator){
		case "add":
			regex = arrayToRegexFunction(syllableArray().subtractSyllables,	true);
			break;
		case "subtract":
			regex = arrayToRegexFunction(syllableArray().subtractSyllables,	true);
			break;
		default:
			break;
	}

	for( var i = 0; i < array.length; i++){
		matches = array[i].match ( regex );
		if ( matches !== null ){
			count += matches.length;
		}
	}
	return count;
};

/*
YoastSEO.PreProcessor.prototype.advancedSyllableCount = function( inputString, regex, operator ) {
	var match = inputString.match( regex );
	if ( match !== null ) {
		if ( operator === "subtract" ) {
			this.syllableCount -= match.length;
		} else if ( operator === "add" ) {
			this.syllableCount += match.length;
		}
	}
};*/