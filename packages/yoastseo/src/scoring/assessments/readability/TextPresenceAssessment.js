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
			urlTitle: "",
			urlCallToAction: "",
		};

		this.identifier = "textPresence";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Assesses that the paper has at least a little bit of content.
	 *
	 * @param {Paper}       paper       The paper to assess.
	 * @param {Researcher}  researcher  The researcher.
	 * @param {Jed}         i18n        The translations object.
	 *
	 * @returns {AssessmentResult} The result of this assessment.
	 */
	getResult( paper, researcher, i18n ) {
		const text = stripHTMLTags( excludeTableOfContentsTag( paper.getText() ) );
		let urlTitle = this._config.urlTitle;
		let urlCallToAction = this._config.urlCallToAction;
		// Get the links
		const links = researcher.getData( "links" );
		// Check if links for the assessment is available in links data
		if ( links[ "shortlinks.metabox.readability.text_presence" ] &&
			links[ "shortlinks.metabox.readability.text_presenceCall_to_action" ] ) {
			// Overwrite default links with links from configuration
			urlTitle = createAnchorOpeningTag( links[ "shortlinks.metabox.readability.text_presence" ] );
			urlCallToAction = createAnchorOpeningTag( links[ "shortlinks.metabox.readability.text_presenceCall_to_action" ] );
		}

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
}
