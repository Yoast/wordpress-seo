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
	var tooLong = countTooLongSentences( sentences, recommendedValue ).length;
	var percentage = ( tooLong / sentences.length ) * 100;
	var score = calculateTooLongSentences( percentage );
	var sentenceLengthURL = "<a href='https://yoa.st/short-sentences' target='_blank'>";

	if ( score >= 7 ) {
		return {
			score: score,
			text: i18n.sprintf( i18n.dgettext(
				"js-text-analysis",
				// Translators: %1$s expands to a link on yoast.com, %2$s expands to the recommended maximum sentence length,
				// %3$s expands to the anchor end tag.
				"The meta description contains no sentences %1$sover %2$s words%3$s."
			), sentenceLengthURL, recommendedValue, "</a>"
			)
		};
	}
	return {
		score: score,
		text: i18n.sprintf( i18n.dngettext(
			"js-text-analysis",
			// Translators: %1$d expands to number of sentences, %2$s expands to a link on yoast.com,
			// %3$s expands to the recommended maximum sentence length, %4$s expands to the anchor end tag.
			"The meta description contains %1$d sentence %2$sover %3$s words%4$s. Try to shorten this sentence.",
			"The meta description contains %1$d sentences %2$sover %3$s words%4$s. Try to shorten these sentences.",
			tooLong ), tooLong, sentenceLengthURL, recommendedValue, "</a>"
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
	identifier: "metaDescriptionSentenceLength",
	getResult: sentenceLengthInDescriptionAssessment,
	isApplicable: function( paper ) {
		return paper.hasDescription();
	}
};
