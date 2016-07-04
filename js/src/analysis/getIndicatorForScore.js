var scoreToRating = require( 'yoastseo' ).helpers.scoreToRating;
var isUndefined = require( 'lodash/isUndefined' );

var hasPresenter = function() {
	var app = YoastSEO.app;

	return ( ! isUndefined( app.seoAssessorPresenter ) || ! isUndefined( app.contentAssessorPresenter ) );
};

var getPresenter = function() {
	var app = YoastSEO.app;

	if ( ! isUndefined( app.seoAssessorPresenter ) ) {
		return app.seoAssessorPresenter;
	}

	if ( ! isUndefined( app.contentAssessorPresenter ) ) {
		return app.contentAssessorPresenter;
	}
};

/**
 * Simple helper function that returns the indicator for a given total score
 *
 * @param {number} score The score from 0 to 100.
 * @returns {Object} The indicator for the given score.
 */
function getIndicatorForScore( score ) {
	// Scale because scoreToRating works from 0 to 10.
	score /= 10;


	var indicator = {
		className: '',
		screenReaderText: '',
		fullText: ''
	};

	var presenter = getPresenter();

	if ( ! hasPresenter() ) {
		return indicator;
	}

	return presenter.getIndicator( scoreToRating( score ) );
}

module.exports = getIndicatorForScore;
