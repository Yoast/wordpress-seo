/* global YoastSEO */

import isUndefined  from "lodash/isUndefined";
import { helpers } from "yoastseo";
import isNil from "lodash/isNil";
const { scoreToRating } = helpers;

/**
 * Returns whether or not the current page has presenters.
 *
 * @returns {boolean} Whether or not the page has presenters.
 */
var hasPresenter = function() {
	var app = YoastSEO.app;

	return ( ! isUndefined( app.seoAssessorPresenter ) || ! isUndefined( app.contentAssessorPresenter ) );
};

/**
 * Returns the presenter that is currently present on the page. Prevent errors if one of the analyses is disabled.
 *
 * @returns {AssessorPresenter} An active assessor presenter.
 */
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
	var indicator = {
		className: "",
		screenReaderText: "",
		fullText: "",
		screenReaderReadabilityText: "",
	};

	if ( ! hasPresenter() ) {
		return indicator;
	}

	if ( isNil( score ) ) {
		indicator.className = "loading";

		return indicator;
	}

	// Scale because scoreToRating works from 0 to 10.
	score /= 10;

	var presenter = getPresenter();

	return presenter.getIndicator( scoreToRating( score ) );
}

module.exports = getIndicatorForScore;
