var SyllableCountStep = require ( "./syllableCountStep.js" );

var isUndefined = require( "lodash/isUndefined" );
var forEach = require ( "lodash/forEach" );

/**
 * Creates a syllable count iterator
 *
 * @param {object} config The config object containing an array with syllable exclusions
 * @constructor
 */
var SyllableCountIterator = function( config ) {
	this.countSteps = [];
	if( !isUndefined( config ) ) {
		this.createSyllableCountSteps( config.syllableExclusion );
	}
};

/**
 * Creates a language syllable regex for each exclusion.
 *
 * @param {object} syllableRegexes The object containing all exclusion syllables including the multipliers.
 */
SyllableCountIterator.prototype.createSyllableCountSteps = function( syllableRegexes ) {
	forEach( syllableRegexes, function( syllableRegex ) {
		this.countSteps.push( new SyllableCountStep( syllableRegex ) );
	}.bind( this ) );
};

/**
 * Returns all available language syllable regexes
 *
 * @returns {Array} All available language syllable regexes.
 */
SyllableCountIterator.prototype.getAvailableSyllableCountSteps = function() {
	return this.countSteps;
};

/**
 * Counts the syllables for all the available syllable regexes and returns the total syllable count.
 *git
 * @param {String} word The word to count syllables in.
 * @returns {number} The number of syllables found based on exclusions
 */
SyllableCountIterator.prototype.countSyllables = function( word ) {
	var syllableCount = 0;
	forEach( this.countSteps, function( step ) {
		syllableCount += step.countSyllables( word );
	} );
	return syllableCount;
};

module.exports = SyllableCountIterator;
