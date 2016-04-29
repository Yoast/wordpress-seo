var AssessmentResult = require( "../values/AssessmentResult.js" );

/**
 * Calculates the score based on the given deviation.
 *
 * @param {number} standardDeviation The deviation to calculate the score for.
 * @returns {number} The calculated score.
 */
var calculateScore = function( standardDeviation ) {
	return 3 + Math.max( Math.min( ( 6 ) * ( standardDeviation - 2.33 ), 6 ), 0 )
};

/**
 * Get the result based on the score. When score is 7 or more, the result is good. Below 7 should be improved.
 *
 * @param {number} standardDeviation The deviation to calculate the score for.
 * @param {object} i18n The object used for translations.
 * @returns {{score: number, text: *}}
 */
var getStandardDeviationResult = function( standardDeviation, i18n ) {
	var score = calculateScore( standardDeviation );
	var recommendedMinimumDeviation = 3;
	
	if ( score >= 7 ) {
		return {
			score: score,
			text : i18n.sprintf(
				i18n.dgettext(
					"js-text-analysis",
					// translators: %1$d expands to the calculated score. %2$d expands to the recommended minimum score
					"The sentence variation score is %1$d, which is above the recommended minimum of %2$d. The text " +
					"contains a nice combination of long and short sentences."
				), standardDeviation, recommendedMinimumDeviation
			)
		}
	}

	return {
		score: score,
		text : i18n.sprintf(
			i18n.dgettext(
				"js-text-analysis",
				// translators: %1$d expands to the calculated score. %2$d expands to the recommended minimum score
				"The sentence variation score is %1$d, which is less than the recommended minimum of %2$d. Try to " +
				"alternate more between long and short sentences."
			), standardDeviation, recommendedMinimumDeviation
		)
	}

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
	var sentenceDeviationResult =  getStandardDeviationResult( standardDeviation, i18n );

	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( sentenceDeviationResult.score );
	assessmentResult.setText( sentenceDeviationResult.text );

	return assessmentResult;
};

module.exports = {
	getResult: getSentenceVariation,
	isApplicable: function( paper ) {
		return paper.hasText();
	}
};

