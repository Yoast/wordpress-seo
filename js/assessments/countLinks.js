var AssessmentResult = require( "../values/AssessmentResult.js" );

/**
 * Returns a score and text based on the number of links.
 *
 * @param {number} linkCount The number of links found in the text.
 * @param {object} i18n The object used for translations
 * @returns {object} resultObject with score and text
 */
var calculateLinkCountResult = function( linkCount, i18n ) {
	if ( linkCount === 0 ) {
		return {
			score: 6,
			text: i18n.dgettext( "js-text-analysis", "No outbound links appear in this page, consider adding some as appropriate." )

		};
	}
	return {};
};

/**
 * Runs the linkCount module, based on this returns an assessment result with score.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations
 * @returns {object} the Assessmentresult
 */
var getLinkStatisticsAssessment = function( paper,  researcher, i18n ) {
	var linkCount = researcher.getResearch( "linkCount" );

	var linkCountResult = calculateLinkCountResult( linkCount, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( linkCountResult.score );
	assessmentResult.setText( linkCountResult.text );

	return assessmentResult;
};

module.exports = {
	getResult: getLinkStatisticsAssessment,
	isApplicable: function ( paper ) {
		return paper.hasText();
	}
};
