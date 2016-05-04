var AssessmentResult = require( "../values/AssessmentResult.js" );
var isUndefined = require( "lodash/isUndefined" );

/**
 * Calculates transition word result
 * @param {object} transitionWordSentences The object containing the total number of sentences and the number of sentences containing
 * a transition word.
 * @param {object} i18n The object used for translations.
 * @returns {object} Object containing score and text.
 */
var calculateTransitionWordResult = function( transitionWordSentences, i18n ) {
	var score, unboundedScore;
	var percentage = ( transitionWordSentences.transitionWordSentences / transitionWordSentences.totalSentences ) * 100;

	if ( percentage <= 23.3 ) {
		// The 10 percentage points from 13.3 to 23.3 are scaled to a range of 6 score points: 6/10 = 0.6.
		// 23.3 scores 9, 13.3 scores 3.
		unboundedScore = 3 + ( 0.6  * ( percentage - 13.3 ) );

		// Scores exceeding 9 are 9, scores below 3 are 3.
		score = Math.max( Math.min ( unboundedScore, 9 ), 3 );
		if ( score < 7 ) {
			var recommendedMinimum = 20;
			return {
				score: score,
				text: i18n.sprintf(
					i18n.dgettext( "js-text-analysis", "%1$s of the sentences contain a transition word or phrase, " +
						"which is less than the recommended minimum of %2$s." ),
					percentage.toFixed( 1 ) + "%", recommendedMinimum + "%" )
			};
		}
	}

	if ( percentage >= 26.7 ) {
		// The 10 percentage points from 26.7 to 36.7 are scaled to a range of 6 score points: 6/10 = 0.6.
		// 26.7 scores 9, 36.7 scores 3.
		unboundedScore = 9 - ( 0.6 * ( percentage - 26.7 ) );

		// Scores exceeding 9 are 9, scores below 3 are 3.
		score = Math.max( Math.min ( unboundedScore, 9 ), 3 );
		if ( score < 7 ) {
			var recommendedMaximum = 30;
			return {
				score: score,
				text: i18n.sprintf( i18n.dgettext( "js-text-analysis", "%1$s of the sentences contain a transition word or phrase, " +
					"which is more than the recommended maximum of %2$s." ), percentage.toFixed( 1 ) + "%", recommendedMaximum + "%" )
			};
		}
	}

	if ( isUndefined( score ) ) {
		score = 9;
	}

	return {
		score: score,
		text: i18n.sprintf( i18n.dgettext( "js-text-analysis", "%1$s of the sentences contain a transition word or phrase, which is great."
		), percentage.toFixed( 1 ) + "%" )
	};
};

/**
 * Scores the percentage of sentences including one or more transition words.
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} The Assessment result.
 */

var transitionWordsAssessment = function( paper, researcher, i18n ) {
	var transitionWordSentences = researcher.getResearch( "findTransitionWords" );
	var transitionWordResult = calculateTransitionWordResult( transitionWordSentences, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( transitionWordResult.score );
	assessmentResult.setText( transitionWordResult.text );

	return assessmentResult;
};

module.exports = {
	getResult: transitionWordsAssessment,
	isApplicable: function( paper ) {
		return paper.hasText();
	}
};
