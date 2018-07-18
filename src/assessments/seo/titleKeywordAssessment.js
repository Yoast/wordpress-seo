var AssessmentResult = require( "../../values/AssessmentResult.js" );
var escape = require( "lodash/escape" );

/**
 * Executes the pagetitle keyword assessment and returns an assessment result.
 * @param {Paper} paper The Paper object to assess.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 * @param {object} i18n The locale object.
 * @returns {AssessmentResult} The result of the assessment with text and score
 */
var titleHasKeywordAssessment = function( paper, researcher, i18n ) {
	var keywordMatches = researcher.getResearch( "findKeywordInPageTitle" );
	var score, text;
	const url = "<a href='https://yoa.st/2pn' target='_blank'>";

	if ( keywordMatches.matches === 0 ) {
		score = 2;
		text = i18n.sprintf(
			/* Translators: %1$s expands to the focus keyword, %2$s expands to a link on yoast.com,
			%3$s expands to the anchor end tag */
			i18n.dgettext( "js-text-analysis", "The focus keyword '%1$s' does " +
				"not appear in the %2$sSEO title%3$s." ), escape( paper.getKeyword() ),	url, "</a>"
		);
	}

	if ( keywordMatches.matches > 0 && keywordMatches.position === 0 ) {
		score = 9;
		text = i18n.sprintf(
			/* Translators:  %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
			i18n.dgettext( "js-text-analysis", "The %1$sSEO title%2$s contains the focus keyword, at the beginning which is considered " +
			"to improve rankings." ), url, "</a>"
		);
	}

	if ( keywordMatches.matches > 0 && keywordMatches.position > 0 ) {
		score = 6;
		text = i18n.sprintf(
			i18n.dgettext( "js-text-analysis", "The %1$sSEO title%2$s contains the focus keyword, but it does not appear at the beginning;" +
			" try and move it to the beginning." ), url, "</a>"
		);
	}
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( score );
	assessmentResult.setText( text );

	return assessmentResult;
};

module.exports = {
	identifier: "titleKeyword",
	getResult: titleHasKeywordAssessment,
	isApplicable: function( paper ) {
		return paper.hasKeyword();
	},
};
