var arrayToRegexFunction = require( "../stringProcessing/arrayToRegex.js" );
var syllableArray = require( "../config/syllables.js" );

/**
 *
 * @param text
 * @param {String} operator 
 * @returns {number}
 */
module.exports = function( text, operator ){
	var matches, count = 0, array = text.split( " " );
	var regex = "";
	switch(operator){
		case "add":
			regex = arrayToRegexFunction(syllableArray().addSyllables,	true);
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
