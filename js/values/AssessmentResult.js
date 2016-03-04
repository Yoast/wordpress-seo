var isUndefined = require( "lodash/lang/isUndefined" );

/**
 * Construct the AssessmentResult value object.
 * @param {number} score The score that was found by assessment.
 * @param {string} text The user facing message regarding the score.
 * @constructor
 */
var AssessmentResult = function( score, text ) {
	this.score = score;
	this.text = text || "";
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
 * Check if a text is available.
 * @returns {boolean} Whether or not a text is available.
 */
AssessmentResult.prototype.hasText = function () {
	return this.text !== "" && !isUndefined( this.text );
};

/**
 * Get the available text
 * @returns {string} The text associated with the AssessmentResult.
 */
AssessmentResult.prototype.getText = function () {
	return this.text;
};

module.exports = AssessmentResult;
