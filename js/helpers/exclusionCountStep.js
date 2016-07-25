var isUndefined = require( "lodash/isUndefined" );
var forEach = require( "lodash/forEach" );


var ExclusionCountStep = function( exclusionRegex ) {
	this._regexBeginLetters = exclusionRegex.regexBeginLetters || [];
	this._regexEndLetters = exclusionRegex.regexEndLetters || [];
	this._regexLetters = exclusionRegex.regexLetters || [];
	this._matchBegin = exclusionRegex.matchBegin || false;
	this._matchEnd = exclusionRegex.matchEnd || false;
	this._exclusionParts = exclusionRegex.exclusionParts;
};

/**
 * Creates the regex based on the suffixes and prefixes from the config.
 * @param word
 * @returns {RegExp}
 */
ExclusionCountStep.prototype.createRegex = function( word ) {
	var regexParts = [];

	forEach( this._regexBeginLetters, function( letter ) {
		if( this._matchBegin ) {
			regexParts.push( "^" + word + letter );
		}
	}.bind( this ) );

	forEach( this._regexEndLetters, function( letter ) {
		if( this._matchEnd ) {
			regexParts.push( word + letter + "$" );
		}
	}.bind( this ) );

	if( this._matchBegin && this._regexBeginLetters.length === 0 ) {
		regexParts.push( "^" + word );
	}

	if( this._matchEnd && this._regexEndLetters.length === 0 ) {
		regexParts.push(  word + "$" );
	}

	forEach( this._regexLetters, function( letter ) {
		regexParts.push( word + letter );
	}.bind( this ) );

	var regexString = "(" + regexParts.join ( "|" ) + ")";

	if( regexParts.length === 0 ) {
		regexString = word;
	}

	return new RegExp ( regexString );
};

ExclusionCountStep.prototype.matchExclusion = function( word, exclusion ) {
	return word.match( this.createRegex( exclusion ) ) || [];
};

ExclusionCountStep.prototype.isValidExclusion = function( word, exclusion ) {
	return this.matchExclusion( word, exclusion ).length !== 0;
};


ExclusionCountStep.prototype.findWord = function( word ) {
	var foundExclusionPart = "";
	forEach( this._exclusionParts, function( exclusionPart ) {
		if( word.indexOf( exclusionPart.word ) > -1 && this.isValidExclusion( word, exclusionPart.word ) ) {
			foundExclusionPart = exclusionPart;
		}
	}.bind( this ) );
	return foundExclusionPart;
};

ExclusionCountStep.prototype.getSyllablesWithRegex = function( word, exclusionPart ) {
	var syllableCount = exclusionPart.syllables;
	word = word.replace( exclusionPart.word, " " );

	return { syllablecount: syllableCount, word: word };
};

ExclusionCountStep.prototype.countSyllables = function ( word ) {
	var syllableCount = 0;
	var exclusionPart = this.findWord( word );

	if( exclusionPart !== "" ) {
		var results = this.getSyllablesWithRegex( word, exclusionPart );
		syllableCount = results.syllablecount;
		word = results.word;
	}

	return( { syllableCount: syllableCount, word: word } );
};

module.exports = ExclusionCountStep;
