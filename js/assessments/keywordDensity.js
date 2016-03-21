var AssessmentResult = require( "../values/AssessmentResult.js" );
var matchWords = require( "../stringProcessing/matchTextWithWord.js" );
var inRange = require( "lodash/number/inRange" );

/**
 * Returns the scores and text for keyword density
 * @param {string} keywordDensity The keyword density
 * @param {object} i18n The i18n object used for translations
 * @returns {{score: number, text: *}} the assessmentresult
 */
var calculateKeywordDensityResult = function( keywordDensity, i18n ) {
	if ( keywordDensity > 3.5 ) {
		return {
			score: -50,
			text: i18n.dgettext( "js-text-analysis", "The keyword density is %1$s%%, which is way over the advised 2.5%% maximum;" +
				" the focus keyword was found %2$d times." )
		};
	}
	if ( inRange( keywordDensity, 2.5, 3.5 ) ) {
		return {
			score: -10,
			text: i18n.dgettext( "js-text-analysis", "The keyword density is %1$s%%, which is over the advised 2.5%% maximum;" +
				" the focus keyword was found %2$d times." )
		};
	}
	if ( inRange( keywordDensity, 0.5, 2.5 ) ) {
		return {
			score: 9,
			text: i18n.dgettext( "js-text-analysis", "The keyword density is %1$s%%, which is great; the focus keyword was found %2$d times." )
		};
	}
	if ( inRange( keywordDensity, 0, 0.5 ) ) {
		return {
			score: 4,
			text: i18n.dgettext( "js-text-analysis", "The keyword density is %1$s%%, which is a bit low; the focus keyword was found %2$d times." )
		};
	}
};

/**
 * Runs the getkeywordDensity module, based on this returns an assessment result with score.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations
 * @returns {object} the Assessmentresult
 */
var getKeyworDensityAssessment = function( paper,  researcher, i18n ) {

	var keywordDensity = researcher.getResearch( "getKeywordDensity" );
	var keywordCount = matchWords( paper.getText(), paper.getKeyword() );
	var keywordDensityResult = calculateKeywordDensityResult( keywordDensity, i18n, keywordCount );

	var assessmentResult = new AssessmentResult();

	var text = i18n.sprintf( keywordDensityResult.text, keywordDensity, keywordCount );

	assessmentResult.setScore( keywordDensityResult.score );
	assessmentResult.setText( text );

	return assessmentResult;
};

module.exports = getKeyworDensityAssessment;
