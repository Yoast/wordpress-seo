import { mapValues, merge } from "lodash";

import Assessment from "../assessment";
import AssessmentResult from "../../../values/AssessmentResult";
import { createAnchorOpeningTag } from "../../../helpers";

/**
 * Represents the assessment that checks if all images have alt tags (only applicable for product pages).
 */
export default class ImageAltTagsAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {object}  config      The configuration to use.
	 * @param {number}  [config.scores.bad]   The score to return if not all images have alt tags.
	 * @param {number}  [config.scores.good]  The score to return if all images have alt tags.
	 * @param {string}  [config.urlTitle]     The URL to the article about this assessment.
	 * @param {string}  [config.urlCallToAction]  The URL to the help article for this assessment.
	 * @param {object} [config.callbacks] The callbacks to use for the assessment.
	 * @param {function}  [config.callbacks.getResultTexts]  The function that returns the result texts.
	 *
	 * @returns {void}
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
	 * Checks whether the paper has text with at least 1 image.
	 *
	 * @param {Paper}       paper       The paper to use for the assessment.
	 * @param {Researcher}  researcher  The Researcher object containing all available researches.
	 *
	 * @returns {boolean} True when there is text.
	 */
	isApplicable( paper, researcher ) {
		this.imageCount = researcher.getResearch( "imageCount" );
		return paper.hasText() && this.imageCount > 0;
	}

	/**
	 * Calculates the result based on the availability of images in the text.
	 *
	 * @returns {Object} The calculated result.
	 */
	calculateResult() {
		// The number of images with no alt tags.
		const imagesNoAlt = this.altTagsProperties.noAlt;
		const { good: goodResultText, noneHasAltBad, someHaveAltBad } = this.getFeedbackStrings();

		// None of the images has alt tags.
		if ( imagesNoAlt === this.imageCount ) {
			return {
				score: this._config.scores.bad,
				resultText: noneHasAltBad,
			};
		}

		// Not all images have alt tags.
		if ( imagesNoAlt > 0 ) {
			return {
				score: this._config.scores.bad,
				resultText: someHaveAltBad,
			};
		}

		// All images have alt tags.
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
	 * - noneHasAltBad: string
	 * - someHaveAltBad: string
	 *
	 * @returns {{good: string, noneHasAltBad: string, someHaveAltBad: string}} The feedback strings.
	 */
	getFeedbackStrings() {
		// `urlTitleAnchorOpeningTag` represents the anchor opening tag with the URL to the article about this assessment.
		const urlTitleAnchorOpeningTag = createAnchorOpeningTag( this._config.urlTitle );
		// `urlActionAnchorOpeningTag` represents the anchor opening tag with the URL for the call to action.
		const urlActionAnchorOpeningTag = createAnchorOpeningTag( this._config.urlCallToAction );

		const numberOfImagesWithoutAlt = this.altTagsProperties.noAlt;

		if ( ! this._config.callbacks.getResultTexts ) {
			const defaultResultTexts = {
				good: "%1$sImage alt tags%3$s: All images have alt attributes. Good job!",
				noneHasAltBad: "%1$sImage alt tags%3$s: None of the images has alt attributes. %2$sAdd alt attributes to your images%3$s!",
				someHaveAltBad: "%1$sImage alt tags%3$s: Some images don't have alt attributes. %2$sAdd alt attributes to your images%3$s!",
			};
			if ( numberOfImagesWithoutAlt === 1 ) {
				defaultResultTexts.someHaveAltBad = "%1$sImage alt tags%3$s: One image doesn't have alt attributes. %2$sAdd alt attributes to your images%3$s!";
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
