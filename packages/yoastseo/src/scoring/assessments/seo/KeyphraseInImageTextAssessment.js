import { __, _n, sprintf } from "@wordpress/i18n";
import { merge } from "lodash";

import Assessment from "../assessment";
import { inRangeStartEndInclusive } from "../../helpers/assessments/inRange.js";
import { createAnchorOpeningTag } from "../../../helpers";
import AssessmentResult from "../../../values/AssessmentResult";

/**
 * @typedef {import("../../../languageProcessing/AbstractResearcher").default } Researcher
 * @typedef {import("../../../values/").Paper } Paper
 */

/**
 * Represents the assessment that checks if there are keyphrase or synonyms in the alt attributes of images.
 */
export default class KeyphraseInImagesAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {object} config The configuration to use.
	 * @param {object} [config.parameters] The parameters to use for the assessment.
	 * @param {number} [config.parameters.lowerBoundary] The lower boundary for the number of keyphrase matches.
	 * @param {number} [config.parameters.upperBoundary] The upper boundary for the number of keyphrase matches.
	 * @param {object} [config.scores] The scores to use for the assessment.
	 * @param {number} [config.scores.withAltGoodNumberOfKeywordMatches] The score to return if there is a good number of keyphrase matches.
	 * @param {number} [config.scores.withAltTooFewKeywordMatches] The score to return if there are too few keyphrase matches.
	 * @param {number} [config.scores.withAltTooManyKeywordMatches] The score to return if there are too many keyphrase matches.
	 * @param {number} [config.scores.withAltNonKeyword] The score to return if there are alt attributes without keyphrase.
	 * @param {number} [config.scores.withAlt] The score to return if there are alt attributes with keyphrase.
	 * @param {number} [config.scores.noAlt] The score to return if there are no alt attributes.
	 * @param {number} [config.scores.noImagesOrKeyphrase] The score to return if there are no images or no keyphrase.
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			parameters: {
				lowerBoundary: 0.3,
				upperBoundary: 0.75,
			},
			scores: {
				withAltGoodNumberOfKeywordMatches: 9,
				withAltTooFewKeywordMatches: 6,
				withAltTooManyKeywordMatches: 6,
				withAltNonKeyword: 6,
				withAlt: 6,
				noAlt: 6,
				noImagesOrKeyphrase: 3,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/4f7" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/4f6" ),
		};

		this.identifier = "imageKeyphrase";
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
		this.imageCount = researcher.getResearch( "imageCount" );
		if ( this.imageCount > 0 ) {
			this.altProperties = researcher.getResearch( "altTagCount" );

			this._minNumberOfKeyphraseMatches = Math.ceil( this.imageCount * this._config.parameters.lowerBoundary );
			this._maxNumberOfKeyphraseMatches = Math.floor( this.imageCount * this._config.parameters.upperBoundary );
		}

		const calculatedScore = this.calculateResult( paper );

		const assessmentResult = new AssessmentResult();
		assessmentResult.setScore( calculatedScore.score );
		assessmentResult.setText( calculatedScore.resultText );

		return assessmentResult;
	}

	/**
	 * Checks whether there are too few alt attributes with keyphrases. This check is applicable when there are
	 * 5 or more images.
	 *
	 * @returns {boolean} Returns true if there are at least 5 images and the number of alt attributes
	 * with keyphrases is under the specified recommended minimum.
	 */
	hasTooFewMatches() {
		return this.imageCount > 4 && this.altProperties.withAltKeyword > 0 &&
			this.altProperties.withAltKeyword < this._minNumberOfKeyphraseMatches;
	}

	/**
	 * Checks whether there is a sufficient number of alt attributes with keyphrases. There are different recommended
	 * ranges for less than 5 keyphrases, exactly 5 keyphrases, and more than 5 keyphrases.
	 *
	 * @returns {boolean} Returns true if the number of alt attributes with keyphrases is within the recommended range.
	 */
	hasGoodNumberOfMatches() {
		return ( ( this.imageCount < 5 && this.altProperties.withAltKeyword > 0 ) ||
			( this.imageCount === 5 && inRangeStartEndInclusive( this.altProperties.withAltKeyword, 2, 4 ) ) ||
			( this.imageCount > 4 &&
				inRangeStartEndInclusive( this.altProperties.withAltKeyword, this._minNumberOfKeyphraseMatches, this._maxNumberOfKeyphraseMatches ) )
		);
	}

	/**
	 * Checks whether the number of alt attributes containing the keyphrases is more than 75% of the total images found.
	 * This check is applicable when there are 5 or more images.
	 *
	 * @returns {boolean} Returns true if there are at least 5 images and the number of alt attributes with keyphrases
	 * is above the recommended range.
	 */
	hasTooManyMatches() {
		return this.imageCount > 4 && this.altProperties.withAltKeyword > this._maxNumberOfKeyphraseMatches;
	}

	/**
	 * Checks whether there are no keyphrase matches in the alt attributes.
	 *
	 * @returns {boolean} Returns true if there are alt attributes without keyphrase matches.
	 */
	hasNoKeyphraseMatches() {
		return this.altProperties.withAltNonKeyword > 0 && this.altProperties.withAltKeyword === 0;
	}

	/**
	 * Calculates the result based on whether there is a keyphrase, the current image count, and current image alt attributes count.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 *
	 * @returns {{score: number, resultText: string}} The calculated result.
	 */
	calculateResult( paper  ) {
		// No images added or no keyphrase set
		if ( ! paper.hasKeyword() || this.imageCount === 0  ) {
			// Has alt attributes, but no keyphrase is set.
			if ( this.altProperties?.withAlt > 0 ) {
				return {
					score: this._config.scores.withAlt,
					resultText: sprintf(
						/* translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
						__(
							"%1$sKeyphrase in image alt attributes%3$s: Images on this page have alt attributes, but you have not set your keyphrase. %2$sFix that%3$s!",
							"wordpress-seo"
						),
						this._config.urlTitle,
						this._config.urlCallToAction,
						"</a>"
					),
				};
			}
			// No images and/or no keyphrase set.
			// We give a score of 3 if there are no images or no keyphrase set, the same score for other assessments with the same condition.
			return {
				score: this._config.scores.noImagesOrKeyphrase,
				resultText: sprintf(
					/* translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
					__(
						"%1$sKeyphrase in image alt attributes%3$s: This page does not have images, a keyphrase, or both. %2$sAdd some images with alt attributes that include the keyphrase or synonyms%3$s!",
						"wordpress-seo"
					),
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}

		// Has alt attributes, but they don't contain the keyphrase even though the keyphrase is set.
		if ( this.hasNoKeyphraseMatches() ) {
			return {
				score: this._config.scores.withAltNonKeyword,
				resultText: sprintf(
					/* translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
					__(
						"%1$sKeyphrase in image alt attributes%3$s: Images on this page do not have alt attributes with at least half of the words from your keyphrase. %2$sFix that%3$s!",
						"wordpress-seo"
					),
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}

		// There are 5 or more images but less than 30% of them have alt attributes with the keyphrase.
		if ( this.hasTooFewMatches() ) {
			return {
				score: this._config.scores.withAltTooFewKeywordMatches,
				resultText: sprintf(
					/* translators: %1$d expands to the number of images containing an alt attribute with the keyphrase,
					 * %2$d expands to the total number of images, %3$s and %4$s expand to links on yoast.com,
					 * %5$s expands to the anchor end tag. */
					_n(
						"%3$sKeyphrase in image alt attributes%5$s: Out of %2$d images on this page, only %1$d has an alt attribute that reflects the topic of your text. %4$sAdd your keyphrase or synonyms to the alt tags of more relevant images%5$s!",
						"%3$sKeyphrase in image alt attributes%5$s: Out of %2$d images on this page, only %1$d have alt attributes that reflect the topic of your text. %4$sAdd your keyphrase or synonyms to the alt tags of more relevant images%5$s!",
						this.altProperties.withAltKeyword,
						"wordpress-seo"
					),
					this.altProperties.withAltKeyword,
					this.imageCount,
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}

		/*
		 * The hasGoodNumberOfMatches check needs to be made before the check for too many matches because of the special rule for
		 * exactly 5 matches.
		 */
		if ( this.hasGoodNumberOfMatches() ) {
			return {
				score: this._config.scores.withAltGoodNumberOfKeywordMatches,
				resultText: sprintf(
					/* translators: %1$s expands to a link on yoast.com,
					 * %2$s expands to the anchor end tag. */
					__(
						"%1$sKeyphrase in image alt attributes%2$s: Good job!",
						"wordpress-seo"
					),
					this._config.urlTitle,
					"</a>"
				),
			};
		}

		if ( this.hasTooManyMatches() ) {
			return {
				score: this._config.scores.withAltTooManyKeywordMatches,
				resultText: sprintf(
					/* translators: %1$d expands to the number of images containing an alt attribute with the keyphrase,
                     * %2$d expands to the total number of images, %3$s and %4$s expand to a link on yoast.com,
					 * %5$s expands to the anchor end tag. */
					__(
						"%3$sKeyphrase in image alt attributes%5$s: Out of %2$d images on this page, %1$d have alt attributes with words from your keyphrase or synonyms. That's a bit much. %4$sOnly include the keyphrase or its synonyms when it really fits the image%5$s.",
						"wordpress-seo"
					),
					this.altProperties.withAltKeyword,
					this.imageCount,
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}

		// There are images, but no alt attributes.
		return {
			score: this._config.scores.noAlt,
			resultText: sprintf(
				/* translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
				__(
					"%1$sKeyphrase in image alt attributes%3$s: Images on this page do not have alt attributes that reflect the topic of your text. %2$sAdd your keyphrase or synonyms to the alt tags of relevant images%3$s!",
					"wordpress-seo"
				),
				this._config.urlTitle,
				this._config.urlCallToAction,
				"</a>"
			),
		};
	}
}
