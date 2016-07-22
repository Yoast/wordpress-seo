var ExclusionCountStep = require ( "./exclusionCountStep.js" );

var isUndefined = require( "lodash/isUndefined" );
var forEach = require ( "lodash/forEach" );

var ExclusionCountIterator = function( config ) {
	this.countSteps = [];
	if( !isUndefined( config ) ) {
		this.createExclusionSteps( config.partlyExclusionWords );
	}
};

ExclusionCountIterator.prototype.createExclusionSteps = function( exclusionSteps ) {
	forEach( exclusionSteps, function( exclusionStep ) {
		this.countSteps.push( new ExclusionCountStep( exclusionStep ) );
	}.bind( this ) );
};

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
