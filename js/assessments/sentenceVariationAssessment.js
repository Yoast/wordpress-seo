var AssessmentResult = require( "../values/AssessmentResult.js" );

var getSentences = require( "../stringProcessing/getSentences.js" );
var inRange = require( "../helpers/inRange.js" ).inRangeStartInclusive;

/**
 * Get the sentence length variation result based on the score.
 *
 * @param {number} standardDeviation The standard deviation to calculate the score for.
 * @param {Object} i18n The object used for translations.
 * @returns {Object} The object containing score and text.
 */

var getStandardDeviationResult = function( standardDeviation, i18n ) {
	var score = 0;
	var recommendedMinimumDeviation = 3;
	var sentenceVariationURL = "<a href='https://yoa.st/mix-it-up' target='_blank'>";

	if ( standardDeviation >= 3 ) {
		// Green indicator.
		score = 9;
	}

	if ( inRange( standardDeviation, 2.5, 3 ) ) {
		// Orange indicator.
		score = 6;
	}

	if ( standardDeviation < 2.5 ) {
		// Red indicator.
		score = 3;
	}

	if ( score >= 7 ) {
		return {
			score: score,
			text: i18n.sprintf(
				i18n.dgettext(
					"js-text-analysis",
					// Translators: %1$s expands to a link on yoast.com, %2$s expands to the calculated score,
					// %3$d expands to the anchor end tag, %4$s expands to the recommended minimum score.
					"The %1$ssentence length variation%2$s score is %3$s, " +
					"which is more than or equal to the recommended minimum of %4$d. " +
					"The text contains a nice combination of long and short sentences."
				), sentenceVariationURL, "</a>", standardDeviation, recommendedMinimumDeviation
			)
		};
	}

	return {
		score: score,
		text: i18n.sprintf(
			i18n.dgettext(
				"js-text-analysis",
				// Translators: %1$s expands to a link on yoast.com, %2$s expands to the calculated score,
				// %3$d expands to the anchor end tag, %4$s expands to the recommended minimum score.
				"The %1$ssentence length variation%2$s score is %3$s, " +
				"which is less than the recommended minimum of %4$d. " +
				"Try to alternate more between long and short sentences."
			), sentenceVariationURL, "</a>", standardDeviation, recommendedMinimumDeviation
		)
	};
};

/**
 * Runs the sentenceVariation research and checks scores based on calculated deviation.
 *
 * @param {Paper} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} The Assessmentresult
 */
var getSentenceVariation = function( paper, researcher, i18n ) {
	var standardDeviation = researcher.getResearch( "sentenceVariation" );

	var assessmentResult = new AssessmentResult();
	var sentenceDeviationResult =  getStandardDeviationResult( standardDeviation, i18n );

	assessmentResult.setScore( sentenceDeviationResult.score );
	assessmentResult.setText( sentenceDeviationResult.text );

	return assessmentResult;
};

module.exports = {
	identifier: "textSentenceLengthVariation",
	getResult: getSentenceVariation,
	isApplicable: function( paper ) {
		var numberOfSentences = getSentences( paper.getText() ).length;
		return paper.hasText() && numberOfSentences > 1;
	}
};

