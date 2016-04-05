var AssessmentResult = require( "../values/AssessmentResult.js" );

/**
 * Assesses the keyphrase presence and length
 *
 * @param {Paper} paper The paper to use for the assessment.
 * @param {Researcher} researcher The researcher used for calling research.
 * @param {Jed} i18n The object used for translations
 * @returns {AssessmentResult} The result of this assessment
*/
function keyphraseAssessment( paper, researcher, i18n ) {
	var keyphraseLength = researcher.getResearch( "keyphraseLength" );

	var assessmentResult = new AssessmentResult();

	if ( !paper.hasKeyword() ) {
		assessmentResult.setScore( -999 );
		assessmentResult.setText( i18n.dgettext( "js-text-analysis", "No focus keyword was set for this page. " +
			"If you do not set a focus keyword, no score can be calculated." ) );
	} else if ( keyphraseLength > 10 ) {
		assessmentResult.setScore( 0 );
		assessmentResult.setText( i18n.dgettext( "js-text-analysis", "Your keyphrase is over 10 words, a keyphrase should be shorter." ) );
	}

	return assessmentResult;
}

module.exports = { getResult: keyphraseAssessment };
