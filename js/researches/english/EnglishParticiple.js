var Participle = require( "../../values/Participle.js" );

var nonVerbsEndingEd = require( "./passivevoice-english/non-verb-ending-ed.js" )();
var getWordIndices = require( "../english/passivevoice-english/wordIndicesRegexes.js" );
var determinerList = require( "./../english/passivevoice-english/determiners.js" )();
var havingList = require( "./../english/passivevoice-english/having.js" )();
var arrayToRegex = require( "../../stringProcessing/createRegexFromArray.js" );

var forEach = require( "lodash/forEach" );
var includes = require( "lodash/includes" );
var isEmpty = require( "lodash/isEmpty" );
var intersection = require( "lodash/intersection" );

var determinersRegex = arrayToRegex( determinerList );
var havingRegex = arrayToRegex( havingList );
var irregularExclusionArray = [ "get", "gets", "getting", "got", "gotten" ];

/**
 * Checks whether a participle is directly preceded by a given word.
 *
 * @param {Array} precedingWords The array of objects with matches and indices.
 * @param {number} participleIndex The index of the participle.
 *
 * @returns {boolean} Returns true if the participle is preceded by a given word, otherwise returns false.
 */
var includesIndex = function( precedingWords, participleIndex ) {
	if ( isEmpty( precedingWords ) ) {
		return false;
	}

	var precedingWordsEndIndices = [];
	forEach( precedingWords, function( precedingWord ) {
		var precedingWordsEndIndex = precedingWord.index + precedingWord.match.length;
		precedingWordsEndIndices.push( precedingWordsEndIndex );
	} );

	return includes( precedingWordsEndIndices, participleIndex );
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
	var determinerMatches = getWordIndices( sentencePart, determinersRegex );
	return includesIndex( determinerMatches, indexOfFit );
};

/**
 * Creates an Participle object for the English language.
 *
 * @param {string} participle The participle.
 * @param {string} sentencePart The sentence part that contains the participle.
 * @param {object} attributes  The attributes object.
 *
 * @constructor
 */
var EnglishParticiple = function( participle, sentencePart, attributes ) {
	Participle.call( this, participle, sentencePart, attributes );
	this.checkException();
};

require( "util" ).inherits( EnglishParticiple, Participle );

/**
 * Sets sentence part passiveness to passive if there is no exception.
 * @returns {void}
 */
EnglishParticiple.prototype.checkException = function() {
	if ( isEmpty( this.getParticiple() ) ) {
		this.setSentencePartPassiveness( false );
		return;
	}

	this.setSentencePartPassiveness( this.isPassive() );
};

/**
 * Checks if there are any exceptions to this participle that would determine the sentencepart
 * not to be passive. If no exceptions are found, the sentence part is passive.
 * @returns {boolean} Returns true if no exception is found.
 */
EnglishParticiple.prototype.isPassive = function() {
	return 	! this.isNonVerbEndingEd() &&
				! this.hasRidException() &&
				! this.hasHavingException() &&
				! this.hasLeftException() &&
				! this.hasFitException();
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
	return includes( nonVerbsEndingEd, this.getParticiple() );
};

/**
 * Checks whether the participle is 'rid' in combination with 'get', 'gets', 'getting', 'got' or 'gotten'.
 * If 'rid' appears in combination with 'get', 'gets', 'getting', 'got' or 'gotten', it is not passive.
 *
 * @returns {boolean} Returns true if 'rid' is found in combination with 'get', 'gets', 'getting', 'got' or 'gotten',
 * otherwise returns false.
 */
EnglishParticiple.prototype.hasRidException = function() {
	if ( this.getParticiple() === "rid" ) {
		var auxiliaries = this.getAuxiliaries();
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
	var sentencePart = this.getSentencePart();
	var wordIndex = sentencePart.indexOf( this.getParticiple() );
	var havingMatch = getWordIndices( sentencePart, havingRegex );
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
