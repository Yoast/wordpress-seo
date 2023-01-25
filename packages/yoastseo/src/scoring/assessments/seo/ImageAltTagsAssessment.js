import { __, _n, sprintf } from "@wordpress/i18n";
import { merge } from "lodash-es";

import Assessment from "../assessment";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import AssessmentResult from "../../../values/AssessmentResult";

/**
 * Represents the assessment that checks if all images have alt tags (only applicable for product pages).
 */
export default class ImageAltTagsAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {object}  config      The configuration to use.
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
			urlTitle: createAnchorOpeningTag( "" ),
			urlCallToAction: createAnchorOpeningTag( "" ),
		};

		this.identifier = "imageAltTags";
		this._config = merge( defaultConfig, config );
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
	 * Calculate the result based on the availability of images in the text, including videos in product pages.
	 *
	 * @returns {Object} The calculated result.
	 */
	calculateResult() {
		// The number of images with no alt tags.
		const imagesNoAlt = this.altTagsProperties.noAlt;

		// None of the images has alt tags.
		if ( imagesNoAlt === this.imageCount ) {
			return {
				score: this._config.scores.bad,
				resultText: sprintf(
					/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
					__(
						"%1$sImage alt tags%3$s: None of the images has alt attributes. %2$sAdd alt attributes to your images%3$s!",
						"wordpress-seo"
					),
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}

		// Not all images have alt tags.
		if ( imagesNoAlt > 0 ) {
			return {
				score: this._config.scores.bad,
				resultText: sprintf(
					/* Translators: %3$s and %4$s expand to links on yoast.com, %5$s expands to the anchor end tag,
					* %1$d expands to the number of images without alt tags,
					* %2$d expands to the number of images found in the text, */
					_n(
						"%3$sImage alt tags%5$s: %1$d image out of %2$d doesn't have alt attributes. %4$sAdd alt attributes to your images%5$s!",
						"%3$sImage alt tags%5$s: %1$d images out of %2$d don't have alt attributes. %4$sAdd alt attributes to your images%5$s!",
						imagesNoAlt,
						"wordpress-seo"
					),
					imagesNoAlt,
					this.imageCount,
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}

		// All images have alt tags.
		return {
			score: this._config.scores.good,
			resultText: sprintf(
				/* Translators: %1$s expands to a link on yoast.com,
				 * %2$s expands to the anchor end tag. */
				__(
					"%1$sImage alt tags%2$s: All images have alt attributes. Good job!",
					"wordpress-seo"
				),
				this._config.urlTitle,
				"</a>"
			),
		};
	}
}
