var AssessmentResult = require( "../values/AssessmentResult.js" );
var countTooLongSentences = require( "./checkForTooLongSentences.js" );

/**
 * Calculates sentence length score
 * @param {array} sentences The array containing sentences.
 * @param {object} i18n The object used for translations.
 * @returns {object} Object containing score and text.
 */
var calculateSentenceLengthResult = function( sentences, i18n ) {
	var recommendedValue = 20;
	var tooLong = countTooLongSentences( sentences, recommendedValue );
	var maximumPercentage = 25;
	var percentage = ( tooLong / sentences.length ) * 100;

	// 6 is the number of scorepoints between 3, minscore and 9, maxscore. For scoring we use 10 steps
	// up to 21.7 is for scoring a 9, lower percentages give lower scores.
	var score = 9 - Math.max( Math.min( ( 6 / 10 ) * ( percentage - 21.7 ), 6 ), 0 );
	if ( score >= 7 ) {
		return{
			score: score,
			text: i18n.sprintf( i18n.dgettext( "js-text-analysis", "%1$d%% of the sentences contain more than 20 words, " +
				"which is within the recommended range." ), percentage )
		};
	}
	return{
		score: score,
		text: i18n.sprintf( i18n.dgettext( "js-text-analysis", "%1$d%% of the sentences contain more than 20 words, " +
			"which is more than the recommended maximum of %2$d%%. Try to shorten your sentences." ), percentage, maximumPercentage )
	};
};
/**
 * Scores the percentage of sentences including more than the recommended number of words.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} the Assessmentresult
 */
var sentenceLengthInTextAssessment = function( paper, researcher, i18n ) {
	var sentenceCount= researcher.getResearch( "countSentenceFromText" );
	var sentenceResult = calculateSentenceLengthResult( sentenceCount, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( sentenceResult.score );
	assessmentResult.setText( sentenceResult.text );

	return assessmentResult;
};

module.exports = {
	getResult: sentenceLengthInTextAssessment,
	isApplicable: function( paper ) {
		return paper.hasText();
	}
};

