var AssessmentResult = require( "../values/AssessmentResult.js" );
var matchWords = require( "../stringProcessing/matchTextWithWord.js" );
var countWords = require( "../stringProcessing/countWords.js" );
var inRange = require( "lodash/inRange" );

/**
 * Returns the scores and text for keyword density
 *
 * @param {string} keywordDensity The keyword density
 * @param {object} i18n The i18n object used for translations
 * @param {number} keywordCount The number of times the keyword has been found in the text.
 * @returns {{score: number, text: *}} The assessment result
 */
var calculateKeywordDensityResult = function( keywordDensity, i18n, keywordCount ) {
	var score, text, max;

	var keywordDensityPercentage = keywordDensity.toFixed( 1 ) + "%";

	if ( keywordDensity > 3.5 ) {
		score = -50;

		/* translators: %1$s expands to the keyword density percentage, %2$d expands to the keyword count,
		%3$s expands to the maximum keyword density percentage. */
		text = i18n.dgettext( "js-text-analysis", "The keyword density is %1$s," +
			" which is way over the advised %3$s maximum;" +
			" the focus keyword was found %2$d times." );

		/* translators: This is the maximum keyword density, localize the number for your language (e.g. 2,5) */
		max = i18n.dgettext( "js-text-analysis", "2.5" ) + "%";

		text = i18n.sprintf( text, keywordDensityPercentage, keywordCount, max );
	}

	if ( inRange( keywordDensity, 2.5, 3.5 ) ) {
		score = -10;

		/* translators: %1$s expands to the keyword density percentage, %2$d expands to the keyword count,
		%3$s expands to the maximum keyword density percentage. */
		text = i18n.dgettext( "js-text-analysis", "The keyword density is %1$s," +
			" which is over the advised %3$s maximum;" +
			" the focus keyword was found %2$d times." );

		/* translators: This is the maximum keyword density, localize the number for your language (e.g. 2,5) */
		max = i18n.dgettext( "js-text-analysis", "2.5" ) + "%";

		text = i18n.sprintf( text, keywordDensityPercentage, keywordCount, max );
	}

	if ( inRange( keywordDensity, 0.5, 2.5 ) ) {
		score = 9;

		/* translators: %1$s expands to the keyword density percentage, %2$d expands to the keyword count. */
		text = i18n.dgettext( "js-text-analysis", "The keyword density is %1$s, which is great;" +
			" the focus keyword was found %2$d times." );

		text = i18n.sprintf( text, keywordDensityPercentage, keywordCount );
	}

	if ( inRange( keywordDensity, 0, 0.5 ) ) {
		score = 4;

		/* translators: %1$s expands to the keyword density percentage, %2$d expands to the keyword count. */
		text = i18n.dgettext( "js-text-analysis", "The keyword density is %1$s, which is a bit low;" +
			" the focus keyword was found %2$d times." );

		text = i18n.sprintf( text, keywordDensityPercentage, keywordCount );
	}

	return {
		score: score,
		text: text
	};
};

/**
 * Runs the getkeywordDensity module, based on this returns an assessment result with score.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations
 * @returns {object} the Assessmentresult
 */
var keywordDensityAssessment = function( paper, researcher, i18n ) {

	var keywordDensity = researcher.getResearch( "getKeywordDensity" );
	var keywordCount = matchWords( paper.getText(), paper.getKeyword() );

	var keywordDensityResult = calculateKeywordDensityResult( keywordDensity, i18n, keywordCount );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( keywordDensityResult.score );
	assessmentResult.setText( keywordDensityResult.text );

	return assessmentResult;
};

module.exports = {
	getResult: keywordDensityAssessment,
	isApplicable: function( paper ) {
		return paper.hasText() && paper.hasKeyword() && countWords( paper.getText() ) >= 100;
	}
};
