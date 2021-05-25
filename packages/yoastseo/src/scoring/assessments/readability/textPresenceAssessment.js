import { __, sprintf } from "@wordpress/i18n";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import { stripFullTags as stripHTMLTags } from "../../../languageProcessing/helpers/sanitize/stripHTMLTags";
import AssessmentResult from "../../../values/AssessmentResult";

/**
 * Assesses that the paper has at least a little bit of content.
 *
 * @param {Paper}       paper       The paper to assess.
 * @param {Researcher}  researcher  The researcher.
 *
 * @returns {AssessmentResult} The result of this assessment.
 */
function textPresenceAssessment( paper, researcher ) {
	const text = stripHTMLTags( paper.getText() );
	const urlTitle = createAnchorOpeningTag( "https://yoa.st/35h" );
	const urlCallToAction = createAnchorOpeningTag( "https://yoa.st/35i" );

	if ( text.length < 50 ) {
		const result = new AssessmentResult();

		result.setText( sprintf(
			/* Translators: %1$s and %3$s expand to links to articles on Yoast.com,
			%2$s expands to the anchor end tag*/
			__(
				"%1$sNot enough content%2$s: %3$sPlease add some content to enable a good analysis%2$s.",
				"wordpress-seo"
			),
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
