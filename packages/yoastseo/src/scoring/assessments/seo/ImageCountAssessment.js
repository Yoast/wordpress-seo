import { merge } from "lodash-es";
import { inRangeStartEndInclusive } from "../../helpers/assessments/inRange";

import Assessment from "../assessment";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import AssessmentResult from "../../../values/AssessmentResult";

/**
 * Represents the assessment that checks if the text has any images present, including videos in product pages.
 */
export default class TextImagesAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {object}  config      The configuration to use.
	 * @param {boolean} countVideos Whether videos are also included in the assessment or not.
	 *
	 * @returns {void}
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
	 * @param {Jed}         i18n        The locale object.
	 *
	 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
	 */
	getResult( paper, researcher, i18n ) {
		this.imageCount = researcher.getResearch( "imageCount" );
		this.videoCount = researcher.getResearch( "videoCount" );

		const calculatedScore = this.calculateResult( i18n );

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
		return paper.hasText();
	}

	/**
	 * Calculate the result based on the availability of images in the text, including videos in product pages.
	 *
	 * @param {Object} i18n The object used for translations.
	 *
	 * @returns {Object} The calculated result.
	 */
	calculateResult( i18n ) {
		// If "countVideos" is on, we include videos in the assessment
		const mediaCount = this._countVideos ? this.imageCount + this.videoCount : this.imageCount;

		// No images.
		if ( mediaCount === 0 ) {
			if ( this._countVideos ) {
				return {
					score: this._config.scores.bad,
					resultText: i18n.sprintf(
						/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
						i18n.dgettext(
							"js-text-analysis",
							"%1$sImages and videos%3$s: No images or videos appear on this page. %2$sAdd some%3$s!"
						),
						this._config.urlTitle,
						this._config.urlCallToAction,
						"</a>"
					),
				};
			}
			return {
				score: this._config.scores.bad,
				resultText: i18n.sprintf(
					/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
					i18n.dgettext(
						"js-text-analysis",
						"%1$sImages%3$s: No images appear on this page. %2$sAdd some%3$s!"
					),
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}

		if ( this._config.scores.okay ) {
			if ( inRangeStartEndInclusive( mediaCount, 1, 3 ) && ! this._countVideos ) {
				return {
					score: this._config.scores.okay,
					resultText: i18n.sprintf(
						/* Translators: %3$s and %4$s expand to links on yoast.com, %5$s expands to the anchor end tag,
						* %1$d expands to the number of images found in the text,
						* %2$d expands to the recommended number of images in the text, */
						i18n.dngettext(
							"js-text-analysis",
							"%3$sImages%5$s: Only %1$d image appears on this page. We recommend at least %2$d. " +
							"%4$sAdd more relevant images%5$s!",
							"%3$sImages%5$s: Only %1$d images appear on this page. We recommend at least %2$d. " +
							"%4$sAdd more relevant images%5$s!",
							mediaCount
						),
						mediaCount,
						this._config.recommendedCount,
						this._config.urlTitle,
						this._config.urlCallToAction,
						"</a>"
					),
				};
			} else if ( inRangeStartEndInclusive( mediaCount, 1, 3 ) && this._countVideos ) {
				return {
					score: this._config.scores.okay,
					resultText: i18n.sprintf(
						/* Translators: %3$s and %4$s expand to links on yoast.com, %5$s expands to the anchor end tag,
						* %1$d expands to the number of images found in the text,
						* %2$d expands to the recommended number of images in the text, */
						i18n.dngettext(
							"js-text-analysis",
							"%3$sImages and videos%5$s: Only %1$d image or video appears on this page. We recommend at least %2$d. " +
							"%4$sAdd more relevant images or videos%5$s!",
							"%3$sImages and videos%5$s: Only %1$d images or videos appear on this page. We recommend at least %2$d. " +
							"%4$sAdd more relevant images or videos%5$s!",
							mediaCount
						),
						mediaCount,
						this._config.recommendedCount,
						this._config.urlTitle,
						this._config.urlCallToAction,
						"</a>"
					),
				};
			}
		}

		if ( this._countVideos ) {
			// Text with at least one image or one video.
			return {
				score: this._config.scores.good,
				resultText: i18n.sprintf(
					/* Translators: %1$s expands to a link on yoast.com,
					 * %2$s expands to the anchor end tag. */
					i18n.dgettext(
						"js-text-analysis",
						"%1$sImages and videos%2$s: Good job!"
					),
					this._config.urlTitle,
					"</a>"
				),
			};
		}

		// Text with at least one image.
		return {
			score: this._config.scores.good,
			resultText: i18n.sprintf(
				/* Translators: %1$s expands to a link on yoast.com,
				 * %2$s expands to the anchor end tag. */
				i18n.dgettext(
					"js-text-analysis",
					"%1$sImages%2$s: Good job!"
				),
				this._config.urlTitle,
				"</a>"
			),
		};
	}
}
