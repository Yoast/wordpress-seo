import { __, _n, sprintf } from "@wordpress/i18n";
import { merge } from "lodash";
import { inRangeStartEndInclusive } from "../../helpers/assessments/inRange";

import Assessment from "../assessment";
import { createAnchorOpeningTag } from "../../../helpers";
import AssessmentResult from "../../../values/AssessmentResult";
import normalizeProductData from "../../../contract/normalizeProductData";

/**
 * @typedef {import("../../../languageProcessing/AbstractResearcher").default } Researcher
 * @typedef {import("../../../values/").Paper } Paper
 */

/**
 * Represents the assessment that checks if the text has any images present, including videos in product pages.
 */
export default class TextImagesAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {object}  config      The configuration to use.
	 * @param {object}  [config.callbacks] The callbacks to use for the assessment.
	 * @param {function}  [config.callbacks.getResultTexts]  The function that returns the result texts.
	 * @param {boolean} countVideos Whether videos are also included in the assessment or not.
	 */
	constructor( config = {}, countVideos = false ) {
		super();

		const defaultConfig = {
			scores: {
				bad: 3,
				good: 9,
			},
			recommendedCount: 1,
			urlTitle: createAnchorOpeningTag( "https://yoa.st/4f4" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/4f5" ),
			callbacks: {},
		};

		this.identifier = "images";
		this._config = merge( defaultConfig, config );
		this._countVideos = countVideos;
	}

	/**
	 * Execute the Assessment and return a result.
	 *
	 * @param {Paper}       paper       The Paper object to assess.
	 * @param {Researcher}  researcher  The Researcher object containing all available researches.
	 *
	 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
	 */
	getResult( paper, researcher ) {
		this.imageCount = researcher.getResearch( "imageCount" );
		this.videoCount = researcher.getResearch( "videoCount" );

		// Text videos are out of scope when the Paper's provided images are being assessed.
		this.includeVideos = this._countVideos && ! paper.hasProvidedImages();
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
	 * Calculate the result based on the availability of images in the text, including videos in product pages.
	 *
	 * @returns {{score: number, resultText: string}} The calculated result.
	 */
	calculateResult() {
		// If "includeVideos" is on, we include videos in the assessment.
		this.mediaCount = this.includeVideos ? this.imageCount + this.videoCount : this.imageCount;

		const { noMedia, okay, good } = this.getFeedbackStrings();

		// No images.
		if ( this.mediaCount === 0 ) {
			return {
				score: this._config.scores.bad,
				resultText: noMedia,
			};
		}

		// Fewer images than recommended. Only applicable when the assessor configured an okay score.
		if ( this._config.scores.okay && inRangeStartEndInclusive( this.mediaCount, 1, 3 ) ) {
			return {
				score: this._config.scores.okay,
				resultText: okay,
			};
		}

		// Text with at least one image, or one video when videos are included.
		return {
			score: this._config.scores.good,
			resultText: good,
		};
	}

	/**
	 * Returns the feedback strings for the assessment.
	 * If you want to override the feedback strings, you can do so by providing a custom callback in the config: `this._config.callbacks.getResultTexts`.
	 * This callback function should return an object with the following properties:
	 * - noMedia: string
	 * - okay: string
	 * - good: string
	 *
	 * The callback receives `countVideos` so it can pick its own wording for the two variants, which is why this
	 * method exposes three keys instead of six. It also receives `isVariableProduct`, because a platform that scopes
	 * the assessment to a product's own images may need to name the places those images live.
	 *
	 * @returns {{noMedia: string, okay: string, good: string}} The feedback strings.
	 */
	getFeedbackStrings() {
		// Both are already anchor opening tags: the assessor wraps the URLs before passing them in.
		const urlTitleAnchorOpeningTag = this._config.urlTitle;
		const urlActionAnchorOpeningTag = this._config.urlCallToAction;

		if ( this._config.callbacks.getResultTexts ) {
			return this._config.callbacks.getResultTexts( {
				urlTitleAnchorOpeningTag,
				urlActionAnchorOpeningTag,
				mediaCount: this.mediaCount,
				recommendedCount: this._config.recommendedCount,
				countVideos: this.includeVideos,
				isVariableProduct: this.isVariableProduct,
			} );
		}

		if ( this.includeVideos ) {
			return {
				noMedia: sprintf(
					/* translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
					__(
						"%1$sImages and videos%3$s: No images or videos appear on this page. %2$sAdd some%3$s!",
						"wordpress-seo"
					),
					urlTitleAnchorOpeningTag,
					urlActionAnchorOpeningTag,
					"</a>"
				),
				okay: sprintf(
					/* translators: %3$s and %4$s expand to links on yoast.com, %5$s expands to the anchor end tag,
					* %1$d expands to the number of images found in the text,
					* %2$d expands to the recommended number of images in the text, */
					_n(
						"%3$sImages and videos%5$s: Only %1$d image or video appears on this page. We recommend at least %2$d. %4$sAdd more relevant images or videos%5$s!",
						"%3$sImages and videos%5$s: Only %1$d images or videos appear on this page. We recommend at least %2$d. %4$sAdd more relevant images or videos%5$s!",
						this.mediaCount,
						"wordpress-seo"
					),
					this.mediaCount,
					this._config.recommendedCount,
					urlTitleAnchorOpeningTag,
					urlActionAnchorOpeningTag,
					"</a>"
				),
				good: sprintf(
					/* translators: %1$s expands to a link on yoast.com,
					 * %2$s expands to the anchor end tag. */
					__(
						"%1$sImages and videos%2$s: Good job!",
						"wordpress-seo"
					),
					urlTitleAnchorOpeningTag,
					"</a>"
				),
			};
		}

		return {
			noMedia: sprintf(
				/* translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
				__(
					"%1$sImages%3$s: No images appear on this page. %2$sAdd some%3$s!",
					"wordpress-seo"
				),
				urlTitleAnchorOpeningTag,
				urlActionAnchorOpeningTag,
				"</a>"
			),
			okay: sprintf(
				/* translators: %3$s and %4$s expand to links on yoast.com, %5$s expands to the anchor end tag,
				* %1$d expands to the number of images found in the text,
				* %2$d expands to the recommended number of images in the text, */
				_n(
					"%3$sImages%5$s: Only %1$d image appears on this page. We recommend at least %2$d. %4$sAdd more relevant images%5$s!",
					"%3$sImages%5$s: Only %1$d images appear on this page. We recommend at least %2$d. %4$sAdd more relevant images%5$s!",
					this.mediaCount,
					"wordpress-seo"
				),
				this.mediaCount,
				this._config.recommendedCount,
				urlTitleAnchorOpeningTag,
				urlActionAnchorOpeningTag,
				"</a>"
			),
			good: sprintf(
				/* translators: %1$s expands to a link on yoast.com,
				 * %2$s expands to the anchor end tag. */
				__(
					"%1$sImages%2$s: Good job!",
					"wordpress-seo"
				),
				urlTitleAnchorOpeningTag,
				"</a>"
			),
		};
	}
}
