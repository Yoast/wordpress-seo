import { __, sprintf } from "@wordpress/i18n";
import { merge } from "lodash-es";
import Assessment from "../assessment";
import AssessmentResult from "../../../values/AssessmentResult";
import { unifyAllSpaces } from "../../../languageProcessing/helpers/sanitize/unifyWhitespace";
import { createAnchorOpeningTag } from "../../../helpers";

/**
 * Represents the assessment that checks whether a text has a title.
 */
export default class TextTitleAssessment extends Assessment {
	/**
	 * Constructs a text title assessment.
	 *
	 * @param {object} config The config to use for the assessment.
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
			urlTitle: createAnchorOpeningTag( "https://yoa.st/4nh" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/4ni" ),
		};

		this.identifier = "textTitleAssessment";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Checks whether the paper has a text title.
	 *
	 * @param {paper} 	paper		The paper to use for the assessment.
	 *
	 * @returns {boolean}	 Whether the paper has a text title.
	 */
	getTextTitle( paper ) {
		let textTitle = paper.getTextTitle();
		textTitle = unifyAllSpaces( textTitle );
		textTitle = textTitle.trim();

		return textTitle.length > 0;
	}

	/**
	 * Runs the getTextTitleData research and based on this, returns an assessment result with score.
	 *
	 * @param {Paper}      paper      The paper to use for the assessment.
	 *
	 * @returns {AssessmentResult} The assessment result.
	 */
	getResult( paper ) {
		const textTitleData = this.getTextTitle( paper );
		const calculatedResult = this.calculateResult( textTitleData );
		const assessmentResult = new AssessmentResult();
		assessmentResult.setScore( calculatedResult.score );
		assessmentResult.setText( calculatedResult.resultText );

		return assessmentResult;
	}

	/**
	 * Returns the result object based on whether the text has a title or not
	 *
	 * @param {boolean} textTitleData Whether the text has a title.
	 *
	 * @returns {{resultText: string, score}} Result object with score and text.
	 */
	calculateResult( textTitleData ) {
		// GOOD result when the text has a title.
		if ( textTitleData ) {
			return {
				score: this._config.scores.good,
				resultText: sprintf(
					/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag. */
					__(
						"%1$sTitle%2$s: Your page has a title. Well done!",
						"wordpress-seo",
					),
					this._config.urlTitle,
					"</a>",
				),
			};
		}

		// BAD if the text is missing a title.
		return {
			score: this._config.scores.bad,
			resultText: sprintf(
				/**
				 * Translators:
				 * %1$s and %2$s expands to a link on yoast.com, %3$s expands to the anchor end tag.
				 */
				__(
					// eslint-disable-next-line max-len
					"%1$sTitle%3$s: Your page does not have a title yet. %2$sAdd one%3$s!",
					"wordpress-seo"
				),
				this._config.urlTitle,
				this._config.urlCallToAction,
				"</a>"
			),
		};
	}
}
