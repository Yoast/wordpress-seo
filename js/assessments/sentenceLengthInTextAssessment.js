var AssessmentResult = require( "../values/AssessmentResult.js" );
var countTooLongSentences = require( "./../assessmentHelpers/checkForTooLongSentences.js" );
var calculateTooLongSentences = require( "./../assessmentHelpers/sentenceLengthPercentageScore.js" );

/**
 * Calculates sentence length score
 * @param {array} sentences The array containing sentences.
 * @param {object} i18n The object used for translations.
 * @returns {object} Object containing score and text.
 */
var calculateSentenceLengthResult = function( sentences, i18n ) {
	var recommendedValue = 20;
	var maximumPercentage = 25;

	var tooLong = countTooLongSentences( sentences, recommendedValue );
	var percentage = ( tooLong / sentences.length ) * 100;

	var score = calculateTooLongSentences( percentage );

	if ( score >= 7 ) {
		return{
			score: score,

			// translators: %1$s expands to number of sentences.
			text: i18n.sprintf( i18n.dgettext( "js-text-analysis", "%1$s of the sentences contain more than 20 words, " +
				"which is within the recommended range." ), percentage + "%" )
		};
	}
	return{
		score: score,

		// translators: %1$s expands to number of sentences.
		text: i18n.sprintf( i18n.dgettext( "js-text-analysis", "%1$s of the sentences contain more than 20 words, " +
			"which is more than the recommended maximum of %2$s. Try to shorten your sentences." ), percentage + "%", maximumPercentage + "%" )
	};
};
/**
 * Scores the percentage of sentences including more than the recommended number of words.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} The Assessmentresult
 */
var sentenceLengthInTextAssessment = function( paper, researcher, i18n ) {
	var sentenceCount= researcher.getResearch( "countSentencesFromText" );
	var sentenceResult = calculateSentenceLengthResult( sentenceCount, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( sentenceResult.score );
	assessmentResult.setText( sentenceResult.text );

	return assessmentResult;
};

module.exports = {
	identifier: "textSentenceLength",
	getResult: sentenceLengthInTextAssessment,
	isApplicable: function( paper ) {
		return paper.hasText();
	}
};
