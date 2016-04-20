var AssessmentResult = require( "../values/AssessmentResult.js" );
var filter = require( "lodash/filter" );

var calculateComplexity = function( wordCount, tooComplexWords, recommendedValue, i18n ) {
	var percentage = ( tooComplexWords.length / wordCount ) * 100;
	var recommendedMaximum = 10;
	var score = 9 - Math.max( Math.min( ( 6 / 10 ) * ( percentage - 6.7 ), 6 ), 0 );
	if ( score >= 7 ) {
		return {
			score: score,
			// translators: %1$d expands to the number of too complex words, %2$d expands to the recommended number of syllables
			text: i18n.sprintf(
				i18n.dgettext(
					"js-text-analysis",
					"%1$d%% of the words contain over %2$d syllables, which is within the recommended range." ),
				percentage, recommendedValue )
		};
	}
	return {
		score: score,
		// translators: %1$d expands to the number of too complex words, %2$d expands to the recommended number of syllables, %2$d
		text: i18n.sprintf(
			i18n.dgettext(
				"js-text-analysis",
				"%1$d%% of the words contain over %2$d syllables, which is more than the recommended maximum of %3$d%%" ),
			percentage, recommendedValue, recommendedMaximum )
	};
};

/**
 * Execute the Assessment and return a result.
 * @param {Paper} paper The Paper object to assess.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 * @param {object} i18n The locale object.
 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
 */
var wordComplexityAssessment = function( paper, researcher, i18n ) {
	var wordComplexity = researcher.getResearch( "wordComplexity" );
	var wordCount = wordComplexity.length;
	var recommendedValue = 4;
	var tooComplexWords = filter( wordComplexity, function( syllables ) {
		return( syllables >= recommendedValue );
	} );
	var complexityResult = calculateComplexity( wordCount, tooComplexWords, recommendedValue, i18n );
	var assessmentResult = new AssessmentResult();
	assessmentResult.setScore( complexityResult.score );
	assessmentResult.setText( complexityResult.text );
	return assessmentResult;
};

module.exports = {
	getResult: wordComplexityAssessment,
	isApplicable: function ( paper ) {
		return paper.hasText();
	}
};
