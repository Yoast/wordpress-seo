var isUndefined = require( "lodash/isUndefined" );

var arrayToRegex = require( "../stringProcessing/createRegexFromArray.js" );

var LanguageSyllableRegex = function( syllableRegex ) {
	this._hasRegex = false;
	this._regex = "";
	this._multiplier = "";
	this.createRegex( syllableRegex );
};

LanguageSyllableRegex.prototype.hasRegex = function() {
	return this._hasRegex;
};

LanguageSyllableRegex.prototype.createRegex = function( syllableRegex ) {
	if( !isUndefined( syllableRegex.syllables ) ) {
		this._hasRegex = true;
		this._regex = arrayToRegex( syllableRegex.syllables, true );
		this._multiplier = syllableRegex.multiplier;
	}
};

LanguageSyllableRegex.prototype.getRegex = function() {
	return this._regex;
};

LanguageSyllableRegex.prototype.countSyllables = function( word ) {
	var match = word.match( this._regex ) || [];
	return match.length * this._multiplier;
};

module.exports = LanguageSyllableRegex;
