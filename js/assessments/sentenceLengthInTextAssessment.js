var AssessmentResult = require( "../values/AssessmentResult.js" );
var countTooLongSentences = require( "./../assessmentHelpers/checkForTooLongSentences.js" );
var formatNumber = require( "../helpers/formatNumber.js" );
var inRange = require( "../helpers/inRange.js" ).inRangeEndInclusive;

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
 * @param {Object} sentences The object containing sentences and their lengths.
 * @param {Object} i18n The object used for translations.
 * @returns {Object} Object containing score and text.
 */
var calculateSentenceLengthResult = function( sentences, i18n ) {
	var score;
	var percentage = 0;
	var tooLongTotal = tooLongSentencesTotal( sentences, recommendedValue );

	if ( sentences.length !== 0 ) {
		percentage = formatNumber( ( tooLongTotal / sentences.length ) * 100 );
	}

	if ( percentage <= 25 ) {
		// Green indicator.
		score = 9;
	}

	if ( inRange( percentage, 25, 30 ) ) {
		// Orange indicator.
		score = 6;
	}

	if ( percentage > 30 ) {
		// Red indicator.
		score = 3;
	}

	var hasMarks = ( percentage > 0 );
	var sentenceLengthURL = "<a href='https://yoa.st/short-sentences' target='_blank'>";

	if ( score >= 7 ) {
		return {
			score: score,
			hasMarks: hasMarks,
			text: i18n.sprintf( i18n.dgettext( "js-text-analysis",
				// Translators: %1$d expands to percentage of sentences, %2$s expands to a link on yoast.com,
				// %3$s expands to the recommended maximum sentence length, %4$s expands to the anchor end tag,
				// %5$s expands to the recommended maximum percentage.
				"%1$s of the sentences contain %2$smore than %3$s words%4$s, which is less than or equal to the recommended maximum of %5$s."
				), percentage + "%", sentenceLengthURL, recommendedValue, "</a>", maximumPercentage + "%"
			)
		};
	}

	return {
		score: score,
		hasMarks: hasMarks,

		// Translators: %1$s expands to the percentage of sentences, %2$d expands to the maximum percentage of sentences.
		// %3$s expands to the recommended amount of words.
		text: i18n.sprintf( i18n.dgettext( "js-text-analysis",

			// Translators: %1$d expands to percentage of sentences, %2$s expands to a link on yoast.com,
			// %3$s expands to the recommended maximum sentence length, %4$s expands to the anchor end tag,
			// %5$s expands to the recommended maximum percentage.
			"%1$s of the sentences contain %2$smore than %3$s words%4$s, which is more than the recommended maximum of %5$s." +
			"Try to shorten your sentences."
			), percentage + "%", sentenceLengthURL, recommendedValue, "</a>", maximumPercentage + "%"
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
