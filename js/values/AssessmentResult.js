var isUndefined = require( "lodash/isUndefined" );
var isNumber = require( "lodash/isNumber" );
var isString = require( "lodash/isString" );

/**
 * Construct the AssessmentResult value object.
 * @constructor
 */
var AssessmentResult = function() {
	this.score = 0;
	this.text = "";
};

/**
 * Check if a score is available.
 * @returns {boolean} Whether or not a score is available.
 */
AssessmentResult.prototype.hasScore = function() {
	return !isUndefined( this.score );
};

/**
 * Get the available score
 * @returns {number} The score associated with the AssessmentResult.
 */
AssessmentResult.prototype.getScore = function() {
	return this.score;
};

/**
 * Set the score for the assessment.
 * @param {number|string} score The score to be used for the score property
 * @returns {void}
 */
AssessmentResult.prototype.setScore = function( score ) {
	if ( !isNumber( score ) && !isString( score ) ) {
		score = 0;
	}

	this.score = score;
};

/**
 * Check if a text is available.
 * @returns {boolean} Whether or not a text is available.
 */
AssessmentResult.prototype.hasText = function() {
	return this.text !== "";
};

/**
 * Get the available text
 * @returns {string} The text associated with the AssessmentResult.
 */
AssessmentResult.prototype.getText = function() {
	return this.text;
};

/**
 * Set the text for the assessment.
 * @param {string} text The text to be used for the text property
 * @returns {void}
 */
AssessmentResult.prototype.setText = function( text ) {
	if ( isUndefined( text ) ) {
		text = "";
	}

	this.text = text;
};

module.exports = AssessmentResult;
