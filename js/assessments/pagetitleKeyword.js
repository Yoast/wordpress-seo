var AssessmentResult = require( "../values/AssessmentResult.js" );
var inRange = require( "lodash/number/inRange" );

var pageTitleKeywordAssessment = function( paper, researcher, i18n ) {
	var findPageTitleKeywordResult = researcher.getResearch( "findKeywordInPageTitle" );
	var score, text;

	if ( findPageTitleKeywordResult. matches === 0 ) {
		score = 2;
		text = i18n.sprintf( i18n.dgettext( "js-text-analysis", "The focus keyword '%1$s' does not appear in the page title." ), paper.getKeyword() );
	}

	if( findPageTitleKeywordResult.matches > 0 && findPageTitleKeywordResult.position === 1 ) {
		score = 9;
		text = i18n.dgettext( "js-text-analysis", "The page title contains the focus keyword, at the beginning which is considered to improve rankings.");
	}
	if( findPageTitleKeywordResult.matches > 0 && findPageTitleKeywordResult.position > 1 ) {
		score = 6;
		text = i18n.dgettext( "js-text-analysis", "The page title contains the focus keyword, but it does not appear at the beginning; try and move it to the beginning.");
	}
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( score );
	assessmentResult.setText( text );

	return assessmentResult;
};

module.exports = pageTitleKeywordAssessment;
