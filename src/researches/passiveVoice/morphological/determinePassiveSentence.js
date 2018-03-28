var filter = require( "lodash/filter" );
var matchWordInSentence = require( "../../../stringProcessing/matchWordInSentence.js" ).isWordInSentence;

// Verb-form lists
var getPassiveVerbsRussian = require( "../../russian/passiveVoice/participles.js" )().all;

/**
 * Matches the sentence against passive verbs.
 *
 * @param {string} sentence The sentence to match against.
 * @param {Array} passiveVerbs The array containing passive verb-forms.
 * @returns {Array} The found passive verbs.
 */
var matchPassiveVerbs = function( sentence, passiveVerbs ) {
	return filter( passiveVerbs, function( word ) {
		if (matchWordInSentence( word, sentence )==true) {
			console.log(word)
		}
		return matchWordInSentence( word, sentence );
	} );
};

/**
 * Checks the passed sentences to see if they contain passive verb-forms.
 *
 * @param {Array} sentence The sentences to match against.
 * @param {Object} language The language of the text.
 * @returns {Array} Array of sentence objects containing the complete sentence and the transition words.
 */
var determineSentenceIsPassive = function( sentence, language ) {
	var passiveVerbs = [];

	switch ( language ) {
		case "ru":
			passiveVerbs = getPassiveVerbsRussian;
			break;
	}
	return matchPassiveVerbs( sentence, passiveVerbs ).length !== 0;
};

/**
 * Determines whether a sentence is passive.
 *
 * @param {string} sentenceText The sentence to determine voice for.
 * @param {string} language The language of the sentence part.

 * @returns {boolean} Returns true if passive, otherwise returns false.
 */
module.exports = function( sentenceText, language ) {
	return determineSentenceIsPassive( sentenceText, language );
};
