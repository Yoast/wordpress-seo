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
	const text = stripHTMLTags( paper.getText() );
	const urlTitle = "<a href='https://yoa.st/35h' target='_blank'>";
	const urlCallToAction = "<a href='https://yoa.st/35i' target='_blank'>";

	if ( text.length < 50 ) {
		const result = new AssessmentResult();

		result.setText( i18n.sprintf(
			/* Translators: %1$s and %3$s expand to links to articles on Yoast.com,
			%2$s expands to the anchor end tag*/
			i18n.dgettext( "js-text-analysis",
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
