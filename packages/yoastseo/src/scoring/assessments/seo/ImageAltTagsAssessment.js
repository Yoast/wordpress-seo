import { mapValues, merge } from "lodash";

import Assessment from "../assessment";
import AssessmentResult from "../../../values/AssessmentResult";
import { createAnchorOpeningTag } from "../../../helpers";

/**
 * @typedef {import("../../../languageProcessing/AbstractResearcher").default } Researcher
 * @typedef {import("../../../values/").Paper } Paper
 */

/**
 * Represents the assessment that checks if all images have alt attributes (only applicable for product pages).
 */
export default class ImageAltTagsAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {object}  config      The configuration to use.
	 * @param {object}  [config.scores] The scores to use for the assessment.
	 * @param {number}  [config.scores.bad]   The score to return if not all images have alt attributes.
	 * @param {number}  [config.scores.good]  The score to return if all images have alt attributes.
	 * @param {string}  [config.urlTitle]     The URL to the article about this assessment.
	 * @param {string}  [config.urlCallToAction]  The URL to the help article for this assessment.
	 * @param {object} [config.callbacks] The callbacks to use for the assessment.
	 * @param {function}  [config.callbacks.getResultTexts]  The function that returns the result texts.
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			scores: {
				bad: 3,
				good: 9,
			},
			urlTitle: "",
			urlCallToAction: "",
			callbacks: {},
		};

		this.identifier = "imageAltTags";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Executes the Assessment and return a result.
	 *
	 * @param {Paper}       paper       The Paper object to assess.
	 * @param {Researcher}  researcher  The Researcher object containing all available researches.
	 *
	 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
	 */
	getResult( paper, researcher ) {
		this.altTagsProperties = researcher.getResearch( "altTagCount" );
		this.imageCount = researcher.getResearch( "imageCount" );

		const calculatedScore = this.calculateResult();

		const assessmentResult = new AssessmentResult();
		assessmentResult.setScore( calculatedScore.score );
		assessmentResult.setText( calculatedScore.resultText );

		return assessmentResult;
	}

	/**
	 * Calculates the result based on the availability of images in the text.
	 *
	 * @returns {{score: number, resultText: string}} The calculated result.
	 */
	calculateResult() {
		// The number of images with no alt attributes.
		const imagesNoAlt = this.altTagsProperties.noAlt;
		const { good: goodResultText,  noImagesBad, noneHasAltBad, someHaveAltBad } = this.getFeedbackStrings();

		// There are no images or no text
		if ( this.imageCount === 0 ) {
			return {
				score: this._config.scores.bad,
				resultText: noImagesBad,
			};
		}

		// None of the images has alt attributes.
		if ( imagesNoAlt === this.imageCount ) {
			return {
				score: this._config.scores.bad,
				resultText: noneHasAltBad,
			};
		}

		// Not all images have alt attributes.
		if ( imagesNoAlt > 0 ) {
			return {
				score: this._config.scores.bad,
				resultText: someHaveAltBad,
			};
		}

		// All images have alt attributes.
		return {
			score: this._config.scores.good,
			resultText: goodResultText,
		};
	}

	/**
	 * Returns the feedback strings for the assessment.
	 * If you want to override the feedback strings, you can do so by providing a custom callback in the config: `this._config.callbacks.getResultTexts`.
	 * This callback function should return an object with the following properties:
	 * - good: string
	 * - noImagesBad: string
	 * - noneHasAltBad: string
	 * - someHaveAltBad: string
	 *
	 * @returns {{good: string, noImagesBad: string, noneHasAltBad: string, someHaveAltBad: string}} The feedback strings.
	 */
	getFeedbackStrings() {
		// `urlTitleAnchorOpeningTag` represents the anchor opening tag with the URL to the article about this assessment.
		const urlTitleAnchorOpeningTag = createAnchorOpeningTag( this._config.urlTitle );
		// `urlActionAnchorOpeningTag` represents the anchor opening tag with the URL for the call to action.
		const urlActionAnchorOpeningTag = createAnchorOpeningTag( this._config.urlCallToAction );

		const numberOfImagesWithoutAlt = this.altTagsProperties.noAlt;

		if ( ! this._config.callbacks.getResultTexts ) {
			const defaultResultTexts = {
				good: "%1$sImage alt attributes%3$s: All images have alt attributes. Good job!",
				noneHasAltBad: "%1$sImage alt attributes%3$s: None of the images have alt attributes. %2$sAdd alt attributes to your images%3$s!",
				noImagesBad: "%1$sImage alt attributes%3$s: This page does not have images with alt attributes. %2$sAdd some%3$s!",
				someHaveAltBad: "%1$sImage alt attributes%3$s: Some images don't have alt attributes. %2$sAdd alt attributes to your images%3$s!",
			};
			if ( numberOfImagesWithoutAlt === 1 ) {
				defaultResultTexts.someHaveAltBad = "%1$sImage alt attributes%3$s: One image doesn't have alt attributes. %2$sAdd alt attributes to your images%3$s!";
			}
			return mapValues(
				defaultResultTexts,
				( resultText ) => this.formatResultText( resultText, urlTitleAnchorOpeningTag, urlActionAnchorOpeningTag )
			);
		}

		return this._config.callbacks.getResultTexts( {
			urlTitleAnchorOpeningTag,
			urlActionAnchorOpeningTag,
			numberOfImagesWithoutAlt,
			totalNumberOfImages: this.imageCount,
		} );
	}
}
