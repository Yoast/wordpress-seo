var AssessmentResult = require( "../values/AssessmentResult.js" );
var fixFloatingPoint = require( "../helpers/fixFloatingPoint.js" );
var filter = require( "lodash/filter" );

/**
 * Calculates the complexity of the text based on the syllables in words.
 * @param {number} wordCount The number of words used.
 * @param {number} tooComplexWords The number of words with 4 or more syllables.
 * @param {number} recommendedValue The recommendedValue for amount of syllables.
 * @param {object} i18n The object used for translations.
 * @returns {{score: number, text}} resultobject with score and text.
 */
var calculateComplexity = function( wordCount, tooComplexWords, recommendedValue, i18n ) {
	var percentage = ( tooComplexWords / wordCount ) * 100;
	percentage = fixFloatingPoint( percentage );
	var recommendedMaximum = 10;
	// 6 is the number of scorepoints between 3, minscore and 9, maxscore. For scoring we use 10 steps. each step i 0.6
	// Up to 6.7 percent is for scoring a 9, higher percentages give lower scores.
	var score = 9 - Math.max( Math.min( ( 0.6 ) * ( percentage - 6.7 ), 6 ), 0 );
	score = fixFloatingPoint ( score );
	if ( score >= 7 ) {
		return {
			score: score,
			text: i18n.sprintf(
				i18n.dgettext(
					"js-text-analysis",
					// translators: %1$s expands to the percentage of complex words, %2$d expands to the recommended number of syllables,
					// %3$s expands to the recommend maximum
					"%1$s of the words contain over %2$d syllables, which is less than the recommended maximum of %3$s" ),
				percentage + "%", recommendedValue, recommendedMaximum + "%"  )
		};
	}
	return {
		score: score,
		text: i18n.sprintf(
			i18n.dgettext(
				"js-text-analysis",
				// translators: %1$s expands to the percentage of too complex words, %2$d expands to the recommended number of syllables
				// %3$s expands to the recommend maximum
				"%1$s of the words contain over %2$d syllables, which is more than the recommended maximum of %3$s" ),
			percentage + "%", recommendedValue, recommendedMaximum + "%" )
	};
};

/**
 * Execute the word complexity assessment and return a result based on the syllables in words
 * @param {Paper} paper The Paper object to assess.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 * @param {object} i18n The object used for translations
 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
 */
var wordComplexityAssessment = function( paper, researcher, i18n ) {
	var wordComplexity = researcher.getResearch( "wordComplexity" );
	var wordCount = wordComplexity.length;
	var recommendedValue = 4;
	var tooComplexWords = filter( wordComplexity, function( syllables ) {
		return( syllables >= recommendedValue );
	} ).length;
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
