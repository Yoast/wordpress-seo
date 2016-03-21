var AssessmentResult = require( "../values/AssessmentResult.js" );

/**
 * Returns a score and text based on the keyword matches object.
 *
 * @param {object} subheadings The object with all subheadings matches.
 * @param {object} i18n The object used for translations
 * @returns {object} resultObject with score and text
 */
var calculateKeywordMatchesResult = function( subheadings, i18n ) {
	if ( subheadings.count === 0 ) {
		return {
			score: 7,
			text: i18n.dgettext( "js-text-analysis", "No subheading tags (like an H2) appear in the copy." )
		};
	}
	if ( subheadings.matches === 0 ) {
		return {
			score: 3,
			text: i18n.dgettext( "js-text-analysis", "You have not used your focus keyword in any subheading (such as an H2) in your copy." )
		};
	}
	if ( subheadings.matches >= 1 ) {
		return {
			score: 9,
			text: i18n.sprintf( i18n.dgettext( "js-text-analysis", "The focus keyword appears in %2$d (out of %1$d) subheadings in the copy. " +
				"While not a major ranking factor, this is beneficial." ), subheadings.count, subheadings.matches )
		};
	}
};

/**
 * Runs the match keyword in subheadings module, based on this returns an assessment result with score.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations
 * @returns {object} the Assessmentresult
 */
var matchKeywordinSubheadingAssessment = function( paper,  researcher, i18n ) {
	var subheadings = researcher.getResearch( "matchKeywordInSubheadings" );
	var subheadingsResult = calculateKeywordMatchesResult( subheadings, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( subheadingsResult.score );
	assessmentResult.setText( subheadingsResult.text );

	return assessmentResult;
};

module.exports = matchKeywordinSubheadingAssessment;
