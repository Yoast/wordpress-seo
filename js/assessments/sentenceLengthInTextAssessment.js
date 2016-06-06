var AssessmentResult = require( "../values/AssessmentResult.js" );
var countTooLongSentences = require( "./../assessmentHelpers/checkForTooLongSentences.js" );
var calculateTooLongSentences = require( "./../assessmentHelpers/sentenceLengthPercentageScore.js" );
var formatNumber = require( "../helpers/formatNumber.js" );

var Mark = require( "../values/Mark.js" );
var addMark = require( "../markers/addMark.js" );


var map = require( "lodash/map" );

var recommendedValue = 20;
var maximumPercentage = 25;

/**
 * Gets the sentences that are qualified as being too long.
 *
 * @param {Object} sentences The sentences to filter through.
 * @param {Number} recommendedValue The recommended number of words.
 * @returns {Array} Array with all the sentences considered to be too long.
 */
var tooLongSentences = function( sentences, recommendedValue ) {
	return countTooLongSentences( sentences, recommendedValue );
};

/**
 * Get the total amount of sentences that are qualified as being too long.
 *
 * @param {Object} sentences The sentences to filter through.
 * @param {Number} recommendedValue The recommended number of words.
 * @returns {Number} The amount of sentences that are considered too long.
 */
var tooLongSentencesTotal = function( sentences, recommendedValue ) {
	return tooLongSentences( sentences, recommendedValue ).length;
};

/**
 * Calculates sentence length score.
 *
 * @param {Object} sentences The object containing sentences and its length.
 * @param {Object} i18n The object used for translations.
 * @returns {Object} Object containing score and text.
 */
var calculateSentenceLengthResult = function( sentences, i18n ) {
	var tooLongTotal = tooLongSentencesTotal( sentences, recommendedValue );
	var percentage = formatNumber( ( tooLongTotal / sentences.length ) * 100 );
	var score = calculateTooLongSentences( percentage );
	var hasMarks = ( percentage > 0 );

	if ( score >= 7 ) {
		return {
			score: score,
			hasMarks: hasMarks,

			// translators: %1$s expands to the percentage of sentences, %2$d expands to the maximum percentage of sentences.
			// %3$s expands to the recommended amount of words.
			text: i18n.sprintf( i18n.dgettext( "js-text-analysis", "%1$s of the sentences contain more than %3$d words, " +
				"which is less than or equal to the recommended maximum of %2$s." ), percentage + "%", maximumPercentage + "%", recommendedValue )
		};
	}

	return {
		score: score,
		hasMarks: hasMarks,

		// translators: %1$s expands to the percentage of sentences, %2$d expands to the maximum percentage of sentences.
		// %3$s expands to the recommended amount of words.
		text: i18n.sprintf( i18n.dgettext( "js-text-analysis", "%1$s of the sentences contain more than %3$d words, " +
			"which is more than the recommended maximum of %2$s. Try to shorten your sentences." ),
			percentage + "%", maximumPercentage + "%", recommendedValue )
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
	var sentenceCount = researcher.getResearch( "countSentencesFromText" );
	var sentenceResult = calculateSentenceLengthResult( sentenceCount, i18n );

	var assessmentResult = new AssessmentResult();
	assessmentResult.setScore( sentenceResult.score );
	assessmentResult.setText( sentenceResult.text );
	assessmentResult.setHasMarks( sentenceResult.hasMarks );

	return assessmentResult;
};

/**
 * Mark the sentences.
 *
 * @param {Paper} paper The paper to use for the marking.
 * @param {Researcher} researcher The researcher to use.
 * @returns {Array} Array with all the marked sentences.
 */
var sentenceLengthMarker = function( paper, researcher ) {
	var sentenceCount = researcher.getResearch( "countSentencesFromText" );
	var sentenceObjects = tooLongSentences( sentenceCount, recommendedValue );

	return map( sentenceObjects, function( sentenceObject ) {
		return new Mark( {
			original: sentenceObject.sentence,
			marked: addMark( sentenceObject.sentence )
		} );
	} );
};

module.exports = {
	identifier: "textSentenceLength",
	getResult: sentenceLengthInTextAssessment,
	isApplicable: function( paper ) {
		return paper.hasText();
	},
	getMarks: sentenceLengthMarker
};
