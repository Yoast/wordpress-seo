var AssessmentResult = require( "../values/AssessmentResult.js" );

var calculatePassiveVoiceResult = function( result, i18n ) {
	var percentage = ( result.passive / result.total ) * 100;
	var recommendedValue = 10;
	var score = 9 - Math.max( Math.min( ( 6 / 10 ) * ( percentage - 6.7 ), 6 ), 0 );

	if ( score >= 7 ) {
		return {
			score: score,
			text: i18n.sprintf( i18n.dgettext( "js-text-analysis", "%1$s of the sentences is written in the passive voice, which is within the recommended range." ),
				percentage + "%" )
		};
	}
	return {
		score: score,

		// translators: %1$d expands to the number of paragraphs, %2$d expands to the recommended value
		text: i18n.sprintf( i18n.dgettext(
			"js-text-analysis",
			"%1$s of the sentences is written in the passive voice, which is more than the recommended maximum of %2$s. Try to use their active counterparts."
		), percentage + "%", recommendedValue + "%" )
	};
};

/**
 * Runs the getParagraphLength module, based on this returns an assessment result with score and text.
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} the Assessmentresult
 */
var paragraphLengthAssessment = function( paper, researcher, i18n ) {
	var passiveVoice = researcher.getResearch( "passiveVoice" );

	var passiveVoiceResult = calculatePassiveVoiceResult( passiveVoice, i18n );

	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( passiveVoiceResult.score );
	assessmentResult.setText( passiveVoiceResult.text );

	return assessmentResult;
};

module.exports = {
	getResult: paragraphLengthAssessment,
	isApplicable: function( paper ) {
		return paper.hasText();
	}
};
