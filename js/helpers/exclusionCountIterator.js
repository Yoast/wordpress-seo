var ExclusionCountStep = require ( "./exclusionCountStep.js" );

var isUndefined = require( "lodash/isUndefined" );
var forEach = require ( "lodash/forEach" );

/**
 * Creates an iterator to count syllables and modify words that match with exclusion parts.
 *
 * @param {object} config The config containing all the exclusion parts and the
 * number of syllables.
 * @constructor
 */
var ExclusionCountIterator = function( config ) {
	this.countSteps = [];
	if( !isUndefined( config ) ) {
		this.createExclusionSteps( config.partialExclusionWords );
	}
};

/**
 * Creates an exclusion step for counting syllables in exclusion words and adds these to the
 * array with count steps.
 *
 * @param {object} exclusionSteps List of exclusion parts.
 */
ExclusionCountIterator.prototype.createExclusionSteps = function( exclusionSteps ) {
	forEach( exclusionSteps, function( exclusionStep ) {
		this.countSteps.push( new ExclusionCountStep( exclusionStep ) );
	}.bind( this ) );
};

/**
 * Count syllables by iterating over every step, returning the number of syllables found
 * and the word.
 *
 * @param {string} word The word to match in exclusions.
 * @returns {object} The object containing syllable count and the formatted word.
 */
ExclusionCountIterator.prototype.countSyllables = function( word ) {
	var syllableCount = 0;
	forEach( this.countSteps, function( step ) {
		var countStepResult = step.countSyllables( word );
		syllableCount += countStepResult.syllableCount;
		word = countStepResult.word
	} );
	return {
		syllableCount: syllableCount,
		word: word
	}
};

module.exports = ExclusionCountIterator;
