import { mapValues, merge } from "lodash";

import Assessment from "../assessment";
import AssessmentResult from "../../../values/AssessmentResult";
import { createAnchorOpeningTag } from "../../../helpers";
import { unifyAllSpaces } from "../../../languageProcessing/helpers/sanitize/unifyWhitespace";

/**
 * Represents the assessment that checks whether a text has a title.
 */
export default class TextTitleAssessment extends Assessment {
	/**
	 * Constructs a text title assessment.
	 *
	 * @param {object} config The config to use for the assessment.
	 * @param {object} [config.scores] The scores to use for the assessment.
	 * @param {number} [config.scores.good] The score to return if the text has a title.
	 * @param {number} [config.scores.bad] The score to return if the text doesn't have a title.
	 * @param {string} [config.urlTitle] The URL to the article about this assessment.
	 * @param {string} [config.urlCallToAction] The URL to the help article for this assessment.
	 * @param {object} [config.callbacks] The callbacks to use for the assessment.
	 * @param {function} [config.callbacks.getResultTexts] The function that returns the result texts.
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
			urlTitle: "https://yoa.st/4nh",
			urlCallToAction: "https://yoa.st/4ni",
			callbacks: {},
		};

		this.identifier = "textTitleAssessment";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Checks whether the paper has a text title.
	 *
	 * @param {Paper} 	paper		The paper to use for the assessment.
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
	 * Gets the title from the Paper and based on this returns an assessment result with score.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
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
	 * Returns the result object based on whether the text has a title or not.
	 *
	 * @param {boolean} textTitleData Whether the text has a title.
	 *
	 * @returns {{resultText: string, score}} Result object with score and text.
	 */
	calculateResult( textTitleData ) {
		const { good: goodResultText, bad: badResultText } = this.getFeedbackStrings();
		// GOOD result when the text has a title.
		if ( textTitleData ) {
			return {
				score: this._config.scores.good,
				resultText: goodResultText,
			};
		}

		// BAD if the text is missing a title.
		return {
			score: this._config.scores.bad,
			resultText: badResultText,
		};
	}

	/**
	 * Gets the feedback strings for the text title assessment.
	 * If you want to override the feedback strings, you can do so by providing a custom callback in the config: `this._config.callbacks.getResultTexts`.
	 * The callback function should return an object with the following properties:
	 * - good: string
	 * - bad: string
	 *
	 * @returns {{good: string, bad: string}} The feedback strings.
	 */
	getFeedbackStrings() {
		// `urlTitleAnchorOpeningTag` represents the anchor opening tag with the URL to the article about this assessment.
		const urlTitleAnchorOpeningTag = createAnchorOpeningTag( this._config.urlTitle );
		// `urlActionAnchorOpeningTag` represents the anchor opening tag with the URL for the call to action.
		const urlActionAnchorOpeningTag = createAnchorOpeningTag( this._config.urlCallToAction );

		if ( ! this._config.callbacks.getResultTexts ) {
			const defaultResultTexts = {
				good: "%1$sTitle%3$s: Your page has a title. Well done!",
				bad: "%1$sTitle%3$s: Your page does not have a title yet. %2$sAdd one%3$s!",
			};
			return mapValues(
				defaultResultTexts,
				( resultText ) => this.formatResultText( resultText, urlTitleAnchorOpeningTag, urlActionAnchorOpeningTag )
			);
		}

		return this._config.callbacks.getResultTexts( {
			urlTitleAnchorOpeningTag,
			urlActionAnchorOpeningTag,
		} );
	}
}
