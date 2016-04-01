var AssessmentResult = require( "../values/AssessmentResult.js" );

/**
 * Returns a score and text based on the subheading matches object.
 *
 * @param {object} subHeadings The object with all subHeadings matches.
 * @param {object} i18n The object used for translations.
 * @returns {object} resultObject with score and text.
 */
var calculateSubheadingMatchesResult = function( subHeadings, i18n ) {
	if ( subHeadings.count === 0 ) {
		return {
			score: 7,
			text: i18n.dgettext( "js-text-analysis", "No subheading tags (like an H2) appear in the copy." )
		};
	}
	return {};
};

/**
 * Runs the match subheadings module, based on this returns an assessment result with score.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} the Assessmentresult
 */
var matchKeywordinSubHeadingAssessment = function( paper, researcher, i18n ) {
	var subHeadings = researcher.getResearch( "matchKeywordInSubheadings" );
	var subHeadingsResult = calculateSubheadingMatchesResult( subHeadings, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( subHeadingsResult.score );
	assessmentResult.setText( subHeadingsResult.text );

	return assessmentResult;
};

module.exports = {
	getResult: matchKeywordinSubHeadingAssessment,
	isApplicable: function( paper ) {
		return paper.hasText();
	}
};

