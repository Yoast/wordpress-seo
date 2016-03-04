var inRange = require( "lodash/number/inRange" );
var isUndefined = require( "lodash/lang/isUndefined" );
var replaceAll = require( "../helpers/replaceAll.js" );

/**
 * Check whether the current item can be seen as a range.
 * @param {object} entry The entry in the assessment configuration.
 * @returns {boolean} Whether or not a range is available.
 */
var hasRange = function( entry ) {
	return entry.hasOwnProperty( "range" ) || ( entry.hasOwnProperty( "min" ) && entry.hasOwnProperty( "max" ) );
};

/**
 * Check whether the result falls within a certain range.
 * @param {object} entry The entry in the assessment configuration.
 * @param {number} result The result given by the analysis.
 * @returns {boolean} Whether or not the entry falls within the given range.
 */
var entryInRange = function( entry, result ) {
	if ( entry.hasOwnProperty( "range" ) ) {
		return inRange( result, entry.range[0], entry.range[1] );
	}

	return inRange( result, entry.min, entry.max );
};

/**
 * Check whether only a min property is available.
 * @param {object} entry The entry in the assessment configuration.
 * @returns {boolean} Whether or not the entry has a min property and no max property.
 */
var hasMinimum = function( entry ) {
	return ( entry.hasOwnProperty( "min" ) && !entry.hasOwnProperty( "max" ) );
};

/**
 * Check whether only a max property is available.
 * @param {object} entry The entry in the assessment configuration.
 * @returns {boolean} Whether or not the entry has a max property and no min property.
 */
var hasMaximum = function( entry ) {
	return ( !entry.hasOwnProperty( "min" ) && entry.hasOwnProperty( "max" ) );
};

/**
 * Construct the AssessmentResult object.
 * @param {number} analysisResult The result of the analysis being assessed.
 * @param {object} analysisConfiguration The configuration containing all the possible scores.
 * @constructor
 */
var AssessmentResultCalculator = function( analysisResult, analysisConfiguration ) {
	this.analysisResult = analysisResult;
	this.configuration = analysisConfiguration;

	if ( isUndefined( analysisConfiguration ) ) {
		return;
	}

	return this.retrieveAssesmentResultScore();
};

/**
 * Retrieve the actual result.
 * @returns {object|string} Returns the resulting object or an empty string if no match is possible.
 */
AssessmentResultCalculator.prototype.retrieveAssesmentResultScore = function() {
	var entries = this.configuration.scoreArray;

	for ( var i = 0; i < entries.length; i++ ) {

		var entry = entries[i];

		if ( hasRange( entry ) && entryInRange( entry, this.analysisResult ) ) {
			return this.getResultObject( entry, this.configuration.replacements );
		}

		if ( hasMinimum( entry ) && this.analysisResult > entry.min ) {
			return this.getResultObject( entry, this.configuration.replacements );
		}

		if ( hasMaximum( entry ) ) {
			return this.getResultObject( entry, this.configuration.replacements );
		}
	}

	return "";
};

/**
 * Get a formatted result object.
 * @param {object} entry The entry in the assessment configuration.
 * @param {object} replacements The replacements to be used within the return message.
 * @returns {object} The resulting object after being formatted.
 */
AssessmentResultCalculator.prototype.getResultObject = function( entry, replacements ) {
	return this.formatResultMessage( { "score":  entry.score, "text":  entry.text }, replacements );
};

/**
 * Format the result message.
 * @param {object} result The result of the assessment.
 * @param {object} replacements The replacements to be used within the return message.
 * @returns {object} The formatted and evaluated result object.
 */
AssessmentResultCalculator.prototype.formatResultMessage = function( result, replacements ) {
	if ( isUndefined( replacements ) ) {
		return result;
	}

	result.text = replaceAll( result.text, replacements );

	// If there's a placeholder, replace that with the actual result value
	if ( result.text.indexOf( "%%result%%" ) > -1 ) {
		result.text = result.text.replace( "%%result%%", this.analysisResult );
	}

	return result;
};

module.exports = AssessmentResultCalculator;
