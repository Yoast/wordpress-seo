import { mapValues, merge } from "lodash";

import Assessment from "../assessment";
import AssessmentResult from "../../../values/AssessmentResult";
import { createAnchorOpeningTag } from "../../../helpers";
import normalizeProductData from "../../../contract/normalizeProductData";

/**
 * @typedef {import("../../../languageProcessing/AbstractResearcher").default } Researcher
 * @typedef {import("../../../values/").Paper } Paper
 */

/**
 * The data a `callbacks.getResultTexts` implementation is given, so a platform can word the feedback for the
 * item it is analyzing without knowing how the assessment reaches its score.
 *
 * @typedef {Object} ImageAltTagsResultTextsInput
 * @property {string} urlTitleAnchorOpeningTag The anchor opening tag for the article about this assessment.
 * @property {string} urlActionAnchorOpeningTag The anchor opening tag for the call to action.
 * @property {number} numberOfImagesWithoutAlt The number of assessed images that have no alt attribute.
 * @property {number} totalNumberOfImages The number of assessed images in total.
 * @property {boolean} isVariableProduct Whether the analyzed item can carry variants.
 */

/**
 * The feedback strings for the four states of this assessment, already formatted with their anchors.
 *
 * Every property is required: the object a callback returns is used as is, so an omitted key renders as an empty
 * result text rather than falling back to the default string.
 *
 * @typedef {Object} ImageAltTagsResultTexts
 * @property {string} good Every assessed image has an alt attribute.
 * @property {string} noImagesBad There are no images at all.
 * @property {string} noneHasAltBad No assessed image has an alt attribute.
 * @property {string} someHaveAltBad Some assessed images have no alt attribute.
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
	 * @param {function(ImageAltTagsResultTextsInput): ImageAltTagsResultTexts} [config.callbacks.getResultTexts] Returns the feedback strings, replacing the defaults.
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
		/*
		 * Only used to pick the wording: a platform that scopes the assessment to a product's own images may
		 * need to name where those images live, and on a variable product that includes the variation images.
		 */
		this.isVariableProduct = normalizeProductData( paper ).isVariableProduct;

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
	 *
	 * A platform can replace them by passing a `callbacks.getResultTexts` in the config, of the shape
	 * `(ImageAltTagsResultTextsInput) => ImageAltTagsResultTexts`. Without that callback the defaults below apply,
	 * so the hook is opt-in and existing consumers are unaffected.
	 *
	 * `isVariableProduct` is handed to the callback because a platform that scopes the assessment to a product's own
	 * images may need to name the places those images live, and on a variable product that includes the variation
	 * images.
	 *
	 * @returns {ImageAltTagsResultTexts} The feedback strings.
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
			isVariableProduct: this.isVariableProduct,
		} );
	}
}
