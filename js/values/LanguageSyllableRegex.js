var isUndefined = require( "lodash/" );

var LanguageSyllableRegex = function( syllableRegex ) {
	this._hasRegex = false;
	this._regex = "";

	this.createRegex( syllableRegex );
};

LanguageSyllableRegex.prototype.hasRegex = function() {
	return this._hasRegex;
};

LanguageSyllableRegex.prototype.createRegex = function( syllableRegex ) {
	if( !isUndefined( syllableRegex.syllables ) ) {

	}
};


module.exports = LanguageSyllableRegex;
