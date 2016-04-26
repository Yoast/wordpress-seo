var AssessmentResult = require( "../values/AssessmentResult.js" );

/**
 * Runs the getSubheadingLength research and checks scores based on length.
 *
 * @param {Paper} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} The Assessmentresult
 */
var getSubheadingsTextLength = function( paper, researcher, i18n ) {

	var subheadingTextsLength = researcher.getResearch( "getSubheadingTextLengths" );

	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( subheadingsLengthResult.score );
	assessmentResult.setText( subheadingsLengthResult.text );

	return assessmentResult;
};

module.exports = {
	getResult: getSubheadingsTextLength,
	isApplicable: function( paper ) {
		return paper.hasText();
	}
};
