/**
 * Counts the syllables by splitting on consonants.
 *
 * @param {String} text A text with words to count syllables.
 * @returns {number} the syllable count
 */
module.exports = function( text ){
	var array = text.split( " " );
	var splitWord, count = 0;

	//split textstring to individual words
	for ( var i = 0; i < array.length; i++ ){

		//split on consonants
		splitWord = array[ i ].split( /[^aeiouy]/g );

		//if the string isn't empty, a consonant was found, up the counter
		for (var j = 0; j < splitWord.length; j++ ){
			if ( splitWord[ j ] !== ""){
				count++;
			}
		}
	}

	return count;
};
