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
 * @typedef {Object} RedundantPhraseInAltTextResultTextsInput
 * @property {string} urlTitleAnchorOpeningTag The anchor opening tag for the article about this assessment.
 * @property {string} urlActionAnchorOpeningTag The anchor opening tag for the call to action.
 * @property {number} redundantPhraseCount The number of assessed images whose alt text contains a redundant phrase.
 */

/**
 * The feedback strings for the single state this assessment can report, already formatted with their anchors.
 *
 * @typedef {Object} RedundantPhraseInAltTextResultTexts
 * @property {string} redundantPhrase At least one alt text contains a redundant phrase.
 */

/**
 * Represents the assessment that checks whether the assessed images have alt text containing a redundant
 * phrase such as "Image of". It assesses the images in the text, or the Paper's provided images when it supplies them.
 */
export default class RedundantPhraseInAltTextAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {object} [config] The configuration to use.
	 * @param {number} [config.scores.okay] The score to return when alt text contains a redundant phrase.
	 * @param {string} [config.urlTitle] The URL to the article about this assessment.
	 * @param {string} [config.urlCallToAction] The URL to the call-to-action article.
	 * @param {object} [config.callbacks] The callbacks to use for the assessment.
	 * @param {function(RedundantPhraseInAltTextResultTextsInput): RedundantPhraseInAltTextResultTexts} [config.callbacks.getResultTexts] Returns the feedback strings, replacing the defaults.
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			scores: {
				okay: 6,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/redundant-phrase-in-alt-text" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/redundant-phrase-in-alt-text-cta" ),
			callbacks: {},
		};

		this.identifier = "redundantPhraseInAltText";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Executes the Assessment and returns a result.
	 *
	 * Returns an empty result when no assessed alt text contains a redundant phrase.
	 * `Assessor.isValidResult` drops a result without a score and a text, which keeps the assessment out of the
	 * list entirely. The same happens for unsupported languages.
	 *
	 * @param {Paper}       paper       The Paper object to assess. Unused: the research reads the images off it.
	 * @param {Researcher}  researcher  The Researcher object containing all available researches.
	 *
	 * @returns {AssessmentResult} The result of the assessment.
	 */
	getResult( paper, researcher ) {
		const { count, flagged } = researcher.getResearch( "redundantPhraseInAltText" );

		this.redundantPhraseCount = count;

		const assessmentResult = new AssessmentResult();

		if ( count === 0 ) {
			return assessmentResult;
		}

		assessmentResult.setScore( this._config.scores.okay );
		/*
		 * Carried on the result so a consumer can point at the images that need work, for example to filter them
		 * in a product's image table. Only set when there is something to flag, so an empty result stays empty.
		 */
		assessmentResult.setFlaggedItems( flagged );
		assessmentResult.setText( this.getFeedbackStrings().redundantPhrase );

		return assessmentResult;
	}

	/**
	 * Returns the feedback strings for the assessment.
	 *
	 * A platform can replace them by passing a `callbacks.getResultTexts` in the config, of the shape
	 * `(RedundantPhraseInAltTextResultTextsInput) => RedundantPhraseInAltTextResultTexts`. Without that callback
	 * the default below applies, so the hook is opt-in and existing consumers are unaffected.
	 *
	 * @returns {RedundantPhraseInAltTextResultTexts} The feedback strings.
	 */
	getFeedbackStrings() {
		// Both are already anchor opening tags: the config wraps the URLs before they get here.
		const urlTitleAnchorOpeningTag = this._config.urlTitle;
		const urlActionAnchorOpeningTag = this._config.urlCallToAction;

		if ( this._config.callbacks.getResultTexts ) {
			return this._config.callbacks.getResultTexts( {
				urlTitleAnchorOpeningTag,
				urlActionAnchorOpeningTag,
				redundantPhraseCount: this.redundantPhraseCount,
			} );
		}

		return {
			redundantPhrase: sprintf(
				/* translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag,
				 * %4$d expands to the number of images whose alt text contains a redundant phrase. */
				_n(
					"%1$sRedundant phrase in alt text%3$s: %4$d of your images has alt text with a phrase like \"Image of\" or similar. %2$sRemove it as screen readers already announce that it's an image. You may keep phrases that describe the type of image (e.g. “photograph”, “illustration”, “screenshot”) if the type is worth pointing out%3$s.",
					"%1$sRedundant phrase in alt text%3$s: %4$d of your images have alt text with a phrase like \"Image of\" or similar. %2$sRemove it as screen readers already announce that it's an image. You may keep phrases that describe the type of image (e.g. “photograph”, “illustration”, “screenshot”) if the type is worth pointing out%3$s.",
					this.redundantPhraseCount,
					"wordpress-seo"
				),
				urlTitleAnchorOpeningTag,
				urlActionAnchorOpeningTag,
				"</a>",
				this.redundantPhraseCount
			),
		};
	}
}
