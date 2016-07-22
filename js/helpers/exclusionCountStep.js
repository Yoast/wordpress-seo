var isUndefined = require( "lodash/isUndefined" );
var forEach = require( "lodash/forEach" );

var ExclusionCountStep = function( exclusionRegex ) {
	this._regexSuffix = exclusionRegex.regexSuffix || "";
	this._regexPrefix = exclusionRegex.prefix || "";
	this._exclusionParts = exclusionRegex.exclusionParts;
};

ExclusionCountStep.prototype.findWord = function( word ) {
	var foundExclusionPart = "";
	forEach( this._exclusionParts, function( exclusionPart ) {
		if( word.indexOf( exclusionPart.word ) > -1 ) {
			foundExclusionPart = exclusionPart;
		}
	} );
	return foundExclusionPart;
};

ExclusionCountStep.prototype.getSyllablesWithRegex = function( word, exclusionPart ) {
	var syllableCount = 0;
	var wordRegex = new RegExp( this._regexPrefix + exclusionPart.word + this._regexSuffix );
	if( word.match( wordRegex ) !== null ) {
		syllableCount = exclusionPart.syllables;
		word = word.replace( exclusionPart.word, " " );
	}
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
