var syllableArray = require( "../config/syllables.js" );

/**
 *
 * @param text
 * @returns {number}
 */
module.exports = function( text ){
	var count = 0, wordArray, regex, matches;
	wordArray = syllableArray().exclusionWords;
	for (var i = 0; i < wordArray.length; i++ ){
		regex = new RegExp ( wordArray[i].word, "ig" );
		matches = text.match (regex);
		if ( matches !== null ){
			count += (matches.length * wordArray[i].syllables);
		}
	}
	return count;
};