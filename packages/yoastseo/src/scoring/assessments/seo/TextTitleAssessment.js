import { __, sprintf } from "@wordpress/i18n";
import { merge } from "lodash-es";

import Assessment from "../assessment";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import AssessmentResult from "../../../values/AssessmentResult";

/**
 * Assessment for checking whether texts (e.g., posts, pages or CPTs) are missing a title.
 */
class TextTitleAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} [config] The configuration to use.
	 * @param {number} [config.scores.good] The score to return if there is a title in the text.
	 * @param {number} [config.scores.bad] The score to return if there is no title in the text.
	 * @param {string} [config.url] The URL to the relevant article on Yoast.com.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			scores: {
				good: 9,
				bad: -10000,
			},
			urlTitle: createAnchorOpeningTag( "https://yoast.com" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoast.com" ),
		};

		this.identifier = "textTitleAssessment";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Runs the getTextTitleData research and based on this, returns an assessment result with score.
	 *
	 * @param {Paper}      paper      The paper to use for the assessment.
	 * @param {Researcher} researcher The researcher used for calling research.
	 *
	 * @returns {AssessmentResult} The assessment result.
	 */
	getResult( paper, researcher ) {
		const textTitleData = researcher.getResearch( "getTextTitleData" );
		const assessmentResult = new AssessmentResult();
		const calculatedResult = this.calculateResult( textTitleData );

		assessmentResult.setScore( calculatedResult.score );
		assessmentResult.setText( calculatedResult.resultText );

		return assessmentResult;
	}

	/**
	 * Returns the result object based on the number of keyword matches in the meta description.
	 *
	 * @returns {Object} Result object with score and text.
	 */
	calculateResult( textTitleData ) {
		// GOOD result when the text has a title.
		if ( textTitleData ) {
			return {
				score: this._config.scores.good,
				resultText: sprintf(
					/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag. */
					__(
						"%1$sText title%2$s: Your copy has a title. Well done!",
						"wordpress-seo"
					),
					this._config.urlTitle,
					"</a>"
				),
			};
		}

		// BAD if the text is missing a title.
		if ( ! textTitleData ) {
			return {
				score: this._config.scores.bad,
				resultText: sprintf(
					/**
					 * Translators:
					 * %1$s and %3$s expands to a link on yoast.com, %2$s expands to the anchor end tag.
					 */
					__(
						// eslint-disable-next-line max-len
						"%1$sText title%2$s: It looks like your copy does not have a title yet. %3$sAdd one%2$s!",
						"wordpress-seo"
					),
					this._config.urlTitle,
					"</a>",
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}
	}
}

export default TextTitleAssessment;
