var AssessmentResult = require( "../values/AssessmentResult.js" );

/**
 * Calculate the score based on whether or not there's a keyword in the url.
 * @param {number} keywordsResult The amount of keywords to be checked against.
 * @param {object} i18n The locale object.
 * @returns {object} The resulting score object.
 */
var calculateUrlKeywordCountResult = function( keywordsResult, i18n ) {

	if ( keywordsResult > 0 ) {
		return {
			score: 9,
			text: i18n.dgettext( "js-text-analysis", "The focus keyword appears in the URL for this page." ),
		};
	}

	return {
		score: 6,
		text: i18n.dgettext( "js-text-analysis", "The focus keyword does not appear in the URL for this page. " +
		                                         "If you decide to rename the URL be sure to check the old URL 301 redirects to the new one!" ),
	};
};

/**
 * Execute the Assessment and return a result.
 * @param {Paper} paper The Paper object to assess.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 * @param {object} i18n The locale object.
 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
 */
var urlHasKeywordAssessment = function( paper, researcher, i18n ) {
	var keywords = researcher.getResearch( "keywordCountInUrl" );
	var keywordsResult = calculateUrlKeywordCountResult( keywords, i18n );

	var assessmentResult = new AssessmentResult();
	assessmentResult.setScore( keywordsResult.score );
	assessmentResult.setText( keywordsResult.text );

	return assessmentResult;
};

module.exports = {
	identifier: "urlKeyword",
	getResult: urlHasKeywordAssessment,
	isApplicable: function( paper ) {
		return paper.hasKeyword() && paper.hasUrl();
	},
};
