var AssessmentResult = require( "../../values/AssessmentResult.js" );

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
	const urlNoKeyword = "<a href='https://yoa.st/2pdd' target='_blank'>";
	const urlKeyphraseTooLong = "<a href='https://yoa.st/2pd' target='_blank'>";

	if ( ! paper.hasKeyword() ) {
		assessmentResult.setScore( -999 );
		assessmentResult.setText( i18n.sprintf(
			/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
			i18n.dgettext( "js-text-analysis", "No %1$sfocus keyword%2$s was set for this page. " +
			"If you do not set a focus keyword, no score can be calculated." ),
			urlNoKeyword, "</a>" )
		);
	} else if ( keyphraseLength > 10 ) {
		assessmentResult.setScore( 0 );
		assessmentResult.setText( i18n.sprintf(
			/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
			i18n.dgettext( "js-text-analysis", "The %1$skeyphrase%2$s is over 10 words, a keyphrase should be shorter." ),
			urlKeyphraseTooLong, "</a>" )
		);
	}

	return assessmentResult;
}

module.exports = {
	identifier: "keyphraseLength",
	getResult: keyphraseAssessment,
};
