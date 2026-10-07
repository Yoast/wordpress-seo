import { _n, sprintf } from "@wordpress/i18n";
import { merge } from "lodash";

import Assessment from "../assessment";
import { createAnchorOpeningTag } from "../../../helpers";
import AssessmentResult from "../../../values/AssessmentResult";

/**
 * @typedef {import("../../../languageProcessing/AbstractResearcher").default } Researcher
 * @typedef {import("../../../values/").Paper } Paper
 */

/**
 * The data a `callbacks.getResultTexts` implementation is given, so a platform can word the feedback for the
 * item it is analyzing without knowing how the assessment reaches its score.
 *
 * @typedef {Object} DuplicateAltTextResultTextsInput
 * @property {string} urlTitleAnchorOpeningTag The anchor opening tag for the article about this assessment.
 * @property {string} urlActionAnchorOpeningTag The anchor opening tag for the call to action.
 * @property {number} duplicateCount The number of assessed images that share their alt text with another image.
 */

/**
 * The feedback string for the one state this assessment can report, already formatted with its anchors.
 *
 * The property is required: the object a callback returns is used as is, so an omitted key renders as an empty
 * result text rather than falling back to the default string.
 *
 * @typedef {Object} DuplicateAltTextResultTexts
 * @property {string} duplicate Two or more different images share the same alt text.
 */

/**
 * Represents the assessment that checks whether different assessed images share the same alt text: the images in
 * the text, or the Paper's provided images when it supplies them.
 */
export default class DuplicateAltTextAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {object} [config] The configuration to use.
	 * @param {number} [config.scores.okay] The score to return when different images share the same alt text.
	 * @param {string} [config.urlTitle] The URL to the article about this assessment.
	 * @param {string} [config.urlCallToAction] The URL to the call-to-action article.
	 * @param {object} [config.callbacks] The callbacks to use for the assessment.
	 * @param {function(DuplicateAltTextResultTextsInput): DuplicateAltTextResultTexts} [config.callbacks.getResultTexts] Returns the feedback strings, replacing the defaults.
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			scores: {
				okay: 6,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/duplicate-alt-text" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/duplicate-alt-text-cta" ),
			callbacks: {},
		};

		this.identifier = "duplicateAltText";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Executes the Assessment and returns a result.
	 *
	 * The result names the flagged images in `flaggedItems`, so a platform can point the user to them.
	 *
	 * Returns an empty result — no score and no text — when no two different images share their alt text.
	 * `Assessor.isValidResult` drops a result without a score and a text, so the assessment is not shown. There is
	 * no green result: "all your images have unique alt text" would be misleading when some alt texts are empty.
	 *
	 * @param {Paper}       paper       The Paper object to assess. Unused: the research reads the images off it.
	 * @param {Researcher}  researcher  The Researcher object containing all available researches.
	 *
	 * @returns {AssessmentResult} The result of the assessment.
	 */
	getResult( paper, researcher ) {
		const { count, flagged } = researcher.getResearch( "duplicateAltText" );
		this.duplicateCount = count;

		const assessmentResult = new AssessmentResult();

		if ( this.duplicateCount === 0 ) {
			return assessmentResult;
		}

		assessmentResult.setScore( this._config.scores.okay );
		assessmentResult.setFlaggedItems( flagged );
		assessmentResult.setText( this.getFeedbackStrings().duplicate );

		return assessmentResult;
	}

	/**
	 * Returns the feedback strings for the assessment.
	 *
	 * A platform can replace them by passing a `callbacks.getResultTexts` in the config, of the shape
	 * `(DuplicateAltTextResultTextsInput) => DuplicateAltTextResultTexts`. Without that callback the default below
	 * applies, so the hook is opt-in and existing consumers are unaffected.
	 *
	 * @returns {DuplicateAltTextResultTexts} The feedback strings.
	 */
	getFeedbackStrings() {
		// Both are already anchor opening tags: the config wraps the URLs before they get here.
		const urlTitleAnchorOpeningTag = this._config.urlTitle;
		const urlActionAnchorOpeningTag = this._config.urlCallToAction;

		if ( this._config.callbacks.getResultTexts ) {
			return this._config.callbacks.getResultTexts( {
				urlTitleAnchorOpeningTag,
				urlActionAnchorOpeningTag,
				duplicateCount: this.duplicateCount,
			} );
		}

		return {
			duplicate: sprintf(
				/* translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag,
				 * %4$d expands to the number of images that share their alt text with another image. */
				_n(
					"%1$sDuplicate alt text%3$s: %4$d of your images shares the same alt text with another image. %2$sMake sure each image has unique alt text%3$s.",
					"%1$sDuplicate alt text%3$s: %4$d of your images share the same alt text with another image. %2$sMake sure each image has unique alt text%3$s.",
					this.duplicateCount,
					"wordpress-seo"
				),
				urlTitleAnchorOpeningTag,
				urlActionAnchorOpeningTag,
				"</a>",
				this.duplicateCount
			),
		};
	}
}
