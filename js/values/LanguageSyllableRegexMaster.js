var LanguageSyllableRegex = require ( "./LanguageSyllableRegex.js" );

var isUndefined = require( "lodash/isUndefined" );
var forEach = require ( "lodash/forEach" );

/**
 * Creates a Language Syllable Regex Master
 *
 * @param {object} config The config object containing an array with syllable exclusions
 * @constructor
 */
var LanguageSyllableRegexMaster = function( config ) {
	this.availableLanguageSyllableRegexes = [];
	if( !isUndefined( config ) ) {
		this.createSyllabeRegexes( config.syllableExclusion );
	}
};

/**
 * Creates a language syllable regex for each exclusion.
 *
 * @param {object} syllableRegexes The object containing all exclusion syllables including the multipliers.
 */
LanguageSyllableRegexMaster.prototype.createSyllabeRegexes = function( syllableRegexes ) {
	forEach( syllableRegexes, function( syllableRegex ) {
		this.availableLanguageSyllableRegexes.push( new LanguageSyllableRegex( syllableRegex ) );
	}.bind( this ) );
};

/**
 * Returns all available language syllable regexes
 *
 * @returns {Array} All available language syllable regexes.
 */
LanguageSyllableRegexMaster.prototype.getAvailableLanguageSyllableRegexes = function() {
	return this.availableLanguageSyllableRegexes;
};

/**
 * Counts the syllables for all the available syllable regexes and returns the total syllable count.
 *
 * @param {String} word The word to count syllables in.
 * @returns {number} The number of syllables found based on exclusions
 */
LanguageSyllableRegexMaster.prototype.countSyllables = function( word ) {
	var syllableCount = 0;
	forEach( this.availableLanguageSyllableRegexes, function( languageSyllableRegex ) {
		syllableCount += languageSyllableRegex.countSyllables( word );
	} );
	return syllableCount;
};

module.exports = LanguageSyllableRegexMaster;
