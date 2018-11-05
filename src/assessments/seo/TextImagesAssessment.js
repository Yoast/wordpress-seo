import { merge } from "lodash-es";

import Assessment from "../../assessment";
import { inRangeStartEndInclusive } from "../../helpers/inRange.js";
import { createAnchorOpeningTag } from "../../helpers/shortlinker";
import AssessmentResult from "../../values/AssessmentResult";

/**
 * Represents the assessment that will look if the images have alt-tags and checks if the keyword is present in one of them.
 */
export default class TextImagesAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {object} config The configuration to use.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			parametersRecalibration: {
				lowerBoundary: 0.3,
				upperBoundary: 0.75,
			},
			scoresRegular: {
				noImages: 3,
				withAltKeyword: 9,
				withAltNonKeyword: 6,
				withAlt: 6,
				noAlt: 6,
			},
			scoresRecalibration: {
				noImages: 3,
				withAltGoodNumberOfKeywordMatches: 9,
				withAltTooFewKeywordMatches: 6,
				withAltTooManyKeywordMatches: 6,
				withAltNonKeyword: 6,
				withAlt: 6,
				noAlt: 6,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/33c" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/33d" ),
		};

		this.identifier = "textImages";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Execute the Assessment and return a result.
	 *
	 * @param {Paper} paper The Paper object to assess.
	 * @param {Researcher} researcher The Researcher object containing all available researches.
	 * @param {Jed} i18n The locale object.
	 *
	 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
	 */
	getResult( paper, researcher, i18n ) {
		this.imageCount = researcher.getResearch( "imageCount" );
		this.altProperties = researcher.getResearch( "altTagCount" );

		let calculatedScore;
		if ( process.env.YOAST_RECALIBRATION === "enabled" ) {
			this._minNumberOfKeywordMatches = Math.ceil( this.imageCount * this._config.parametersRecalibration.lowerBoundary );
			this._maxNumberOfKeywordMatches = Math.floor( this.imageCount * this._config.parametersRecalibration.upperBoundary );

			calculatedScore = this.calculateResultRecalibration( i18n );
		} else {
			calculatedScore = this.calculateResultRegular( i18n );
		}

		const assessmentResult = new AssessmentResult();
		assessmentResult.setScore( calculatedScore.score );
		assessmentResult.setText( calculatedScore.resultText );

		return assessmentResult;
	}

	/**
	 * Checks whether the paper has text.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 *
	 * @returns {boolean} True when there is text.
	 */
	isApplicable( paper ) {
		return paper.hasText();
	}

	/**
	 * Calculate the score and the feedback string based on the current image count and current image alt-tag count.
	 *
	 * @param {Jed} i18n The object used for translations.
	 *
	 * @returns {Object} The calculated score and the feedback string.
	 */
	calculateResultRegular( i18n ) {
		if ( this.imageCount === 0 ) {
			return {
				score: this._config.scoresRegular.noImages,
				resultText: i18n.sprintf(
					/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
					i18n.dgettext( "js-text-analysis", "%1$sImage alt attributes%3$s: No images appear on this page. %2$sAdd some%3$s!" ),
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}

		// Has alt-tag and keywords
		if ( this.altProperties.withAltKeyword > 0 ) {
			return {
				score: this._config.scoresRegular.withAltKeyword,
				resultText: i18n.sprintf(
					/* Translators:  %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag */
					i18n.dgettext( "js-text-analysis", "%1$sImage alt attributes%2$s: " +
						"Some images on this page contain alt attributes with words from your keyphrase! Good job!" ),
					this._config.urlTitle,
					"</a>"
				),
			};
		}

		// Has alt-tag, but no keywords and it's not okay
		if ( this.altProperties.withAltNonKeyword > 0 ) {
			return {
				score: this._config.scoresRegular.withAltNonKeyword,
				resultText: i18n.sprintf(
					/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
					i18n.dgettext( "js-text-analysis", "%1$sImage alt attributes%3$s: " +
						"Images on this page do not have alt attributes with words from your keyphrase. %2$sFix that%3$s!" ),
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}

		// Has alt-tag, but no keyword is set
		if ( this.altProperties.withAlt > 0 ) {
			return {
				score: this._config.scoresRegular.withAlt,
				resultText: i18n.sprintf(
					/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
					i18n.dgettext( "js-text-analysis", "%1$sImage alt attributes%3$s: " +
						"Images on this page do not have alt attributes with words from your keyphrase. %2$sFix that%3$s!" ),
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}

		// Has no alt-tag
		if ( this.altProperties.noAlt > 0 ) {
			return {
				score: this._config.scoresRegular.noAlt,
				resultText: i18n.sprintf(
					/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
					i18n.dgettext( "js-text-analysis", "%1$sImage alt attributes%3$s: " +
						"Images on this page do not have alt attributes with words from your keyphrase. %2$sFix that%3$s!" ),
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}
		return null;
	}

	/**
	 * Checks whether there are too few alt tags with keywords. This check is applicable when there are
	 * 5 or more images.
	 *
	 * @returns {boolean} Returns true if there are at least 5 images and the number of alt tags
	 * with keywords is under the specified recommended minimum.
	 */
	hasTooFewMatches() {
		return this.imageCount > 4 && this.altProperties.withAltKeyword > 0 &&
			this.altProperties.withAltKeyword < this._minNumberOfKeywordMatches;
	}

	/**
	 * Checks whether there is a sufficient number of alt tags with keywords. There are different recommended
	 * ranges for less than 5 keywords, exactly 5 keywords, and more than 5 keywords.
	 *
	 * @returns {boolean} Returns true if the number of alt tags with keywords is within the recommended range.
	 */
	hasGoodNumberOfMatches() {
		return ( ( this.imageCount < 5 && this.altProperties.withAltKeyword > 0 ) ||
			( this.imageCount === 5 && inRangeStartEndInclusive( this.altProperties.withAltKeyword, 2, 4 ) ) ||
			( this.imageCount > 4 &&
				inRangeStartEndInclusive( this.altProperties.withAltKeyword, this._minNumberOfKeywordMatches, this._maxNumberOfKeywordMatches ) ) );
	}

	/**
	 * Checks whether the only image has an alt-tag with the keyphrase (needed to return a nice feedback).
	 *
	 * @returns {boolean} Returns true if the only image has an alt-tag with the keyphrase.
	 */
	hasOneImageWithKeyword() {
		return ( this.imageCount === 1 && this.altProperties.withAltKeyword === 1 );
	}

	/**
	 * Checks whether there is a sufficient number of alt tags with keywords. This check is applicable when there are
	 * 5 or more images.
	 *
	 * @returns {boolean} Returns true if there are at least 5 images and the number of alt tags with keywords
	 * is within the recommended range.
	 */
	hasTooManyMatches() {
		return this.imageCount > 4 && this.altProperties.withAltKeyword > this._maxNumberOfKeywordMatches;
	}


	/**
	 * Calculate the result based on the current image count and current image alt-tag count.
	 *
	 * @param {Object} i18n The object used for translations.
	 *
	 * @returns {Object} The calculated result.
	 */
	calculateResultRecalibration( i18n ) {
		// No images.
		if ( this.imageCount === 0 ) {
			return {
				score: this._config.scoresRecalibration.noImages,
				resultText: i18n.sprintf(
					/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
					i18n.dgettext(
						"js-text-analysis",
						"%1$sImage alt attributes%3$s: No images appear on this page. %2$sAdd some%3$s!"
					),
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}

		// Has alt-tags, but no keyword is set.
		if ( this.altProperties.withAlt > 0 ) {
			return {
				score: this._config.scoresRecalibration.withAlt,
				resultText: i18n.sprintf(
					/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
					i18n.dgettext(
						"js-text-analysis",
						"%1$sImage alt attributes%3$s: " +
						"Images on this page have alt attributes, but you have not set your keyphrase. %2$sFix that%3$s!"
					),
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}

		// Has alt-tags, but no keywords while a keyword is set.
		if ( this.altProperties.withAltNonKeyword > 0 && this.altProperties.withAltKeyword === 0 ) {
			return {
				score: this._config.scoresRecalibration.withAltNonKeyword,
				resultText: i18n.sprintf(
					/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
					i18n.dgettext(
						"js-text-analysis",
						"%1$sImage alt attributes%3$s: " +
						"Images on this page do not have alt attributes with at least half of the words from your keyphrase. %2$sFix that%3$s!"
					),
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}

		// Image count ≥5, has alt-tags with too few keywords.
		if ( this.hasTooFewMatches() ) {
			return {
				score: this._config.scoresRecalibration.withAltTooFewKeywordMatches,
				resultText: i18n.sprintf(
					/* Translators: %1$d expands to the number of images containing an alt attribute with the keyword,
					 * %2$d expands to the total number of images, %3$s and %4$s expand to links on yoast.com,
					 * %5$s expands to the anchor end tag. */
					i18n.dngettext(
						"js-text-analysis",
						"%3$sImage alt attributes%5$s: Out of %2$d images on this page, only %1$d has an alt attribute with " +
						"at least half of the words from your keyphrase. " +
						"%4$sFix that%5$s!",
						"%3$sImage alt attributes%5$s: Out of %2$d images on this page, only %1$d have alt attributes with " +
						"at least half of the words from your keyphrase. " +
						"%4$sFix that%5$s!",
						this.altProperties.withAltKeyword,
					),
					this.altProperties.withAltKeyword,
					this.imageCount,
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}

		if ( this.hasOneImageWithKeyword() ) {
			return {
				score: this._config.scoresRecalibration.withAltGoodNumberOfKeywordMatches,
				resultText: i18n.sprintf(
					/* Translators: %1$s expands to a link on yoast.com,
					 * %2$s expands to the anchor end tag. */
					i18n.dgettext(
						"js-text-analysis",
						"%1$sImage alt attributes%2$s: The image on this page contains an alt attribute with at least half " +
						"of the words from the keyphrase. Good job!",
					),
					this._config.urlTitle,
					"</a>"
				),
			};
		}

		/*
		 * This check needs to be made before the check for too many matches because of the special rule for
		 * exactly 5 matches.
		 */
		if ( this.hasGoodNumberOfMatches() ) {
			return {
				score: this._config.scoresRecalibration.withAltGoodNumberOfKeywordMatches,
				resultText: i18n.sprintf(
					/* Translators: %1$d expands to the number of images containing an alt attribute with the keyword,
                     * %2$d expands to the total number of images, %3$s expands to a link on yoast.com,
					 * %4$s expands to the anchor end tag. */
					i18n.dngettext(
						"js-text-analysis",
						"%3$sImage alt attributes%4$s: Out of %2$d images on this page, %1$d has an alt attribute with at " +
						"least half of the words from the keyphrase. Good job!",
						"%3$sImage alt attributes%4$s: Out of %2$d images on this page, %1$d have alt attributes with at " +
						"least half of the words from the keyphrase. Good job!",
						this.altProperties.withAltKeyword
					),
					this.altProperties.withAltKeyword,
					this.imageCount,
					this._config.urlTitle,
					"</a>"
				),
			};
		}

		if ( this.hasTooManyMatches() ) {
			return {
				score: this._config.scoresRecalibration.withAltTooManyKeywordMatches,
				resultText: i18n.sprintf(
					/* Translators: %1$d expands to the number of images containing an alt attribute with the keyword,
                     * %2$d expands to the total number of images, %3$s and %4$s expand to a link on yoast.com,
					 * %5$s expands to the anchor end tag. */
					i18n.dgettext(
						"js-text-analysis",
						"%3$sImage alt attributes%5$s: Out of %2$d images on this page, %1$d have alt attributes with at " +
						"least half of the words from the keyphrase. " +
						"That's a bit much. %4$sOnly include the focus keyphrase when it really fits the image%5$s.",
					),
					this.altProperties.withAltKeyword,
					this.imageCount,
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}

		// Images, but no alt tags.
		return {
			score: this._config.scoresRecalibration.noAlt,
			resultText: i18n.sprintf(
				/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
				i18n.dgettext( "js-text-analysis", "%1$sImage alt attributes%3$s: " +
					"Images on this page do not have alt attributes with words from your keyphrase. %2$sFix that%3$s!" ),
				this._config.urlTitle,
				this._config.urlCallToAction,
				"</a>"
			),
		};
	}
}
