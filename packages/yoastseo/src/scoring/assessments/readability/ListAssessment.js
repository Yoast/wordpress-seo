import { mapValues, merge } from "lodash";

import Assessment from "../assessment";
import AssessmentResult from "../../../values/AssessmentResult";
import { createAnchorOpeningTag } from "../../../helpers";

/**
 * Represents the assessment that will look if the text has a list (only applicable for product pages).
 */
export default class ListAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {object} config The configuration to use.
	 * @param {string} [config.urlTitle] The URL to the article about this assessment.
	 * @param {string} [config.urlCallToAction] The URL to the help article for this assessment.
	 * @param {object} [config.scores] The scores to use for the assessment.
	 * @param {number} [config.scores.bad] The score to return if the text has no list.
	 * @param {number} [config.scores.good] The score to return if the text has a list.
	 * @param {object} [config.callbacks] The callbacks to use for the assessment.
	 * @param {function} [config.callbacks.getResultTexts] The function that returns the result texts.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			urlTitle: "https://yoa.st/shopify38",
			urlCallToAction: "https://yoa.st/shopify39",
			scores: {
				bad: 3,
				good: 9,
			},
			callbacks: {},
		};

		this._config = merge( defaultConfig, config );

		this.identifier = "listsPresence";
	}

	/**
	 * Checks whether there is an ordered or unordered list in the paper.
	 * @param {Paper}	paper	The paper to analyze.
	 * @returns {boolean} Whether there is a list in the paper.
	 */
	findList( paper ) {
		const foundLists = paper.getTree().findAll( node => node.name === "ul" || node.name === "ol" );
		/*
		This is a helper function to check if a list is not empty.
		A list is not empty if it has at least one <li> child with paragraph node.
		*/
		const isListNotEmpty = list => list.childNodes.some( child => child.name === "li" && child.childNodes.some( node => node.name === "p" ) );

		return foundLists.some( isListNotEmpty );
	}

	/**
	 * Execute the Assessment and return a result.
	 *
	 * @param {Paper}       paper       The Paper object to assess.
	 *
	 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
	 */
	getResult( paper ) {
		this.textContainsList = this.findList( paper );

		const calculatedScore = this.calculateResult();

		const assessmentResult = new AssessmentResult();
		assessmentResult.setScore( calculatedScore.score );
		assessmentResult.setText( calculatedScore.resultText );

		return assessmentResult;
	}

	/**
	 * Checks whether the paper has text.
	 *
	 * @param {Paper}       paper       The paper to use for the assessment.
	 *
	 * @returns {boolean} True when there is text.
	 */
	isApplicable( paper ) {
		return this.hasEnoughContentForAssessment( paper );
	}

	/**
	 * Calculate the result based on the availability of lists in the text.
	 *
	 * @returns {Object} The calculated result.
	 */
	calculateResult() {
		const { good: goodResultText, bad: badResultText } = this.getFeedbackStrings();
		// Text with at least one list.
		if ( this.textContainsList ) {
			return {
				score: this._config.scores.good,
				resultText: goodResultText,
			};
		}

		// Text with no lists.
		return {
			score: this._config.scores.bad,
			resultText: badResultText,
		};
	}

	/**
	 * Gets the feedback strings for the assessment.
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
				good: "%1$sLists%3$s: There is at least one list on this page. Great!",
				bad: "%1$sLists%3$s: No lists appear on this page. %2$sAdd at least one ordered or unordered list%3$s!",
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
