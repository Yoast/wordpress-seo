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
	var tooLong = countTooLongSentences( sentences, recommendedValue );
	var percentage = ( tooLong / sentences.length ) * 100;

	var score = calculateTooLongSentences( percentage );

	if ( score >= 7 ) {
		return {
			score: score,
			text:  i18n.dgettext( "js-text-analysis", "The meta description contains no sentences over 20 words." )
		};
	}
	return {
		score: score,
		text: i18n.sprintf( i18n.dngettext(
			"js-text-analysis",
			// translators: %1$d expands to number of sentences
			"The meta description contains %1$d sentence over 20 words. Try to shorten this sentence.",
			"The meta description contains %1$d sentences over 20 words. Try to shorten these sentences.",
			tooLong ), tooLong
		)
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
var sentenceLengthInDescriptionAssessment = function( paper, researcher, i18n ) {
	var sentenceCount = researcher.getResearch( "countSentencesFromDescription" );
	var sentenceResult = calculateSentenceLengthResult( sentenceCount, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( sentenceResult.score );
	assessmentResult.setText( sentenceResult.text );

	return assessmentResult;
};

module.exports = {
	getResult: sentenceLengthInDescriptionAssessment,
	isApplicable: function( paper ) {
		return paper.hasDescription();
	}
};
