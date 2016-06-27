var scoreToRating = require( 'yoastseo' ).helpers.scoreToRating;
var isUndefined = require( 'lodash/isUndefined' );

/**
 * Simple helper function that returns the indicator for a given total score
 *
 * @param {number} score The score from 0 to 100.
 * @returns {Object} The indicator for the given score.
 */
function getIndicatorForScore( score ) {
	// Scale because scoreToRating works from 0 to 10.
	score /= 10;

	var app = YoastSEO.app;
	var indicator = {
		className: '',
		screenReaderText: '',
		fullText: ''
	};

	if ( ! isUndefined( app.seoAssessorPresenter ) ) {
		indicator = app.seoAssessorPresenter.getIndicator( scoreToRating( score ) );
	}

	return indicator;
}

module.exports = getIndicatorForScore;
