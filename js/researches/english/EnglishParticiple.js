var Participle = require( "../../values/Participle.js" );

var nonVerbsEndingEd = require( "./passivevoice-english/non-verb-ending-ed.js" )();
var matchDeterminers = require( "../english/passivevoice-english/wordIndicesRegexes.js" )().determiners;
var matchHaving = require( "../english/passivevoice-english/wordIndicesRegexes.js" )().having;

var irregularExclusionArray = [ "get", "gets", "getting", "got", "gotten" ];

var forEach = require( "lodash/forEach" );
var includes = require( "lodash/includes" );
var isEmpty = require( "lodash/isEmpty" );
var intersection = require( "lodash/intersection" );

/**
 * Checks whether a participle is directly preceded by a given word.
 *
 * @param {Array} precedingWords The array of objects with matches and indices.
 * @param {number} participleIndex The index of the participle.
 *
 * @returns {boolean} Returns true if the participle is preceded by a given word, otherwise returns false.
 */
var includesIndex = function( precedingWords, participleIndex ) {
	if ( ! isEmpty( precedingWords ) ) {
		var precedingWordsEndIndices = [];
		forEach( precedingWords, function( precedingWord ) {
			var precedingWordsEndIndex = precedingWord.index + precedingWord.match.length;
			precedingWordsEndIndices.push( precedingWordsEndIndex );
		} );
		return includes( precedingWordsEndIndices, participleIndex );
	}
	return false;
};

/**
 * Looks for a specific participle and checks whether if it is directly preceded by a determiner.
 * If the participle is directly preceded by a determiner it is not a verb, hence the sentence part is not passive.
 *
 * @param {string} participle The participle.
 * @param {string} word The word to check whether it is preceded by a determiner.
 * @param {string} sentencePart The sentence part to find the participle and word index in.
 *
 * @returns {boolean} Returns true if the participle is preceded by a determiner, otherwise returns false.
 */
var isPrecededByDeterminer = function( participle, word, sentencePart ) {
	if ( participle !== word ) {
		return false;
	}
	var indexOfFit = sentencePart.indexOf( word );
	var determinerMatches = matchDeterminers( sentencePart );
	return includesIndex( determinerMatches, indexOfFit );
};

/**
 * Creates an Participle object for the English language.
 *
 * @param {string} participle The participle.
 * @param {string} sentencePart The sentence part that contains the participle.
 * @param {string} auxiliary  The auxiliary in the sentence part.
 * @param {string} type The type of participle found.
 *
 * @constructor
 */
var EnglishParticiple = function( participle, sentencePart, auxiliary, type ) {
	Participle.call( this, participle, sentencePart, auxiliary, type );
	this.isException();
};

require( "util" ).inherits( EnglishParticiple, Participle );

/**
 * Sets sentence part passiveness to passive if there is no exception.
 * @returns {void}
 */
EnglishParticiple.prototype.isException = function() {
	if ( isEmpty( this.getParticiple() ) ) {
		this.setSentencePartPassiveness( false );
		return;
	}
	var isPassive =
		! this.isNonVerbEndingEd() &&
		! this.hasRidException() &&
		! this.hasHavingException() &&
		! this.hasLeftException() &&
		! this.hasFitException();
	this.setSentencePartPassiveness( isPassive );
};

/**
 * Checks whether a found participle is in the nonVerbsEndingEd list.
 * If a word is in the nonVerbsEndingEd list, it isn't a participle.
 * Irregular participles do not end in -ed, and therefore cannot be in the nonVerbsEndingEd list.
 *
 * @returns {boolean} Returns true if it is in the nonVerbsEndingEd list, otherwise returns false.
 */
EnglishParticiple.prototype.isNonVerbEndingEd = function() {
	if ( this.getType() === "irregular" ) {
		return false;
	}
	var participle = this.getParticiple();
	return includes( nonVerbsEndingEd, participle );
};

/**
 * Checks whether the participle is 'rid' in combination with 'get', 'gets', 'getting', 'got' or 'gotten'.
 * If 'rid' appears in combination with 'get', 'gets', 'getting', 'got' or 'gotten', it is not passive.
 *
 * @returns {boolean} Returns true if 'rid' is found in combination with 'get', 'gets', 'getting', 'got' or 'gotten',
 * otherwise returns false.
 */
EnglishParticiple.prototype.hasRidException = function() {
	var participle = this.getParticiple();
	var auxiliaries = this.getAuxiliaries();
	if ( participle === "rid" ) {
		return  ! isEmpty( intersection( irregularExclusionArray, auxiliaries ) );
	}
	return false;
};

/**
 * Checks whether the participle is directly preceded by 'having'.
 * If this is the case, the sentence part is not passive.
 *
 * @returns {boolean} Returns true if having is directly preceding the participle, otherwise returns false.
 */
EnglishParticiple.prototype.hasHavingException = function() {
	var participle = this.getParticiple();
	var sentencePart = this.getSentencePart();
	var wordIndex = sentencePart.indexOf( participle );
	var havingMatch = matchHaving( sentencePart );
	return includesIndex( havingMatch, wordIndex );
};

/**
 * Checks whether the participle is 'left', and, if so, if it is directly preceded by a determiner.
 * If 'left' is directly preceded by a determiner it is not a verb, hence the sentence part is not passive.
 *
 * @returns {boolean} Returns true if 'left' is found preceded by a determiner, otherwise returns false.
 */
EnglishParticiple.prototype.hasLeftException = function() {
	return isPrecededByDeterminer( this.getParticiple(), "left", this.getSentencePart() );
};

/**
 * Checks whether the participle is 'fit', and, if so, if it is directly preceded by a determiner.
 * If 'fit' is directly preceded by a determiner it is not a verb, hence the sentence part is not passive.
 *
 * @returns {boolean} Returns true if 'fit' is found preceded by a determiner, otherwise returns false.
 */
EnglishParticiple.prototype.hasFitException = function() {
	return isPrecededByDeterminer( this.getParticiple(), "fit", this.getSentencePart() );
};

module.exports = EnglishParticiple;
