import { __, sprintf } from "@wordpress/i18n";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import excludeTableOfContentsTag from "../../../languageProcessing/helpers/sanitize/excludeTableOfContentsTag";
import { stripFullTags as stripHTMLTags } from "../../../languageProcessing/helpers/sanitize/stripHTMLTags";
import AssessmentResult from "../../../values/AssessmentResult";
import Assessment from "../assessment";
import { merge } from "lodash-es";

/**
 * Represents the assessment that checks whether there is enough text in the paper.
 */
export default class TextPresenceAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {object} config The configuration to use.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/35h" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/35i" ),
		};

		this.identifier = "textPresence";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Assesses that the paper has at least a little bit of content.
	 *
	 * @param {Paper}       paper       The paper to assess.
	 * @param {Researcher}  researcher  The researcher.
	 *
	 * @returns {AssessmentResult} The result of this assessment.
	 */
	// eslint-disable-next-line no-unused-vars
	getResult( paper, researcher ) {
		const text = stripHTMLTags( excludeTableOfContentsTag( paper.getText() ) );

		if ( text.length < 50 ) {
			const result = new AssessmentResult();

			result.setText( sprintf(
				/* Translators: %1$s and %3$s expand to links to articles on Yoast.com,
				%2$s expands to the anchor end tag*/
				__(
					"%1$sNot enough content%2$s: %3$sPlease add some content to enable a good analysis%2$s.",
					"wordpress-seo"
				),
				this._config.urlTitle,
				"</a>",
				this._config.urlCallToAction ) );

			result.setScore( 3 );
			return result;
		}

		return new AssessmentResult();
	}
}
