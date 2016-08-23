var stripHTMLTags = require( "../stringProcessing/stripHTMLTags" ).stripFullTags;
var AssessmentResult = require( "../values/AssessmentResult" );

/**
 * Assesses that the paper has at least a little bit of content.
 *
 * @param {Paper} paper The paper to assess.
 * @param {Researcher} researcher The researcher.
 * @param {Jed} i18n The translations object.
 * @returns {AssessmentResult} The result of this assessment.
 */
function textPresenceAssessment( paper, researcher, i18n ) {
	var text = stripHTMLTags( paper.getText() );

	if ( text.length < 50 ) {
		var result = new AssessmentResult();

		result.setText( i18n.dgettext( "js-text-analysis", "You have far too little content, please add some content to enable a good analysis." ) );
		result.setScore( 3 );

		return result;
	}

	return new AssessmentResult();
}

module.exports = {
	identifier: "textPresence",
	getResult: textPresenceAssessment,
};
