import { stripFullTags as stripHTMLTags } from "../../stringProcessing/stripHTMLTags";
import AssessmentResult from "../../values/AssessmentResult";

/**
 * Assesses that the paper has at least a little bit of content.
 *
 * @param {Paper} paper The paper to assess.
 * @param {Researcher} researcher The researcher.
 * @param {Jed} i18n The translations object.
 * @returns {AssessmentResult} The result of this assessment.
 */
function textPresenceAssessment( paper, researcher, i18n ) {
	let text = stripHTMLTags( paper.getText() );
	let urlTitle = "<a href='https://yoa.st/35h' target='_blank'>";
	let urlCallToAction = "<a href='https://yoa.st/35i' target='_blank'>";

	if ( text.length < 50 ) {
		let result = new AssessmentResult();

		result.setText( i18n.sprintf( i18n.dgettext( "js-text-analysis",

			"%1$sNot enough content%2$s: %3$sPlease add some content to enable a good analysis%2$s." ),
		urlTitle,
		"</a>",
		urlCallToAction ) );

		result.setScore( 3 );
		return result;
	}

	return new AssessmentResult();
}

export default {
	identifier: "textPresence",
	getResult: textPresenceAssessment,
};
