var LanguageSyllableRegex = require ( "./LanguageSyllableRegex.js" );

var forEach = require ( "lodash/forEach" );

var LanguageSyllableRegexMaster = function( config ) {
	this.availableLanguageSyllableRegexes = [];

	this.createSyllabeRegexes( config.addSyllables );


};

LanguageSyllableRegexMaster.prototype.createSyllabeRegexes = function( syllableRegexes ) {
	forEach( syllableRegexes, function( syllableRegex ) {
		this.availableLanguageSyllableRegexes.push( new LanguageSyllableRegex( syllableRegex ) );
	}.bind( this ) );
};

module.exports = LanguageSyllableRegexMaster;
