import { merge } from "lodash-es";

import Assessment from "../assessment";
import { inRangeStartEndInclusive } from "../../helpers/assessments/inRange.js";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import AssessmentResult from "../../../values/AssessmentResult";

/**
 * Represents the assessment that checks if there are keyphrase or synonyms in the alt attributes of images.
 */
export default class KeyphraseInImagesAssessment extends Assessment {
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
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/4f7" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/4f6" ),
		};

		this.identifier = "imageKeyphrase";
		this._config = merge( defaultConfig, config );
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
		this.altProperties = researcher.getResearch( "altTagCount" );

		this._minNumberOfKeywordMatches = Math.ceil( this.imageCount * this._config.parameters.lowerBoundary );
		this._maxNumberOfKeywordMatches = Math.floor( this.imageCount * this._config.parameters.upperBoundary );

		const calculatedScore = this.calculateResult( i18n );

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
	 * Checks whether there is a sufficient number of alt tags with keywords. This check is applicable when there are
	 * 5 or more images.
	 *
	 * @returns {boolean} Returns true if there are at least 5 images and the number of alt tags with keywords
	 * is above the recommended range.
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
	calculateResult( i18n ) {
		// Has alt-tags, but no keyword is set.
		if ( this.altProperties.withAlt > 0 ) {
			return {
				score: this._config.scores.withAlt,
				resultText: i18n.sprintf(
					/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
					i18n.dgettext(
						"js-text-analysis",
						"%1$sImage Keyphrase%3$s: " +
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
				score: this._config.scores.withAltNonKeyword,
				resultText: i18n.sprintf(
					/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
					i18n.dgettext(
						"js-text-analysis",
						"%1$sImage Keyphrase%3$s: " +
						"Images on this page do not have alt attributes with at least half of the words from your keyphrase. " +
						"%2$sFix that%3$s!"
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
				score: this._config.scores.withAltTooFewKeywordMatches,
				resultText: i18n.sprintf(
					/* Translators: %1$d expands to the number of images containing an alt attribute with the keyword,
					 * %2$d expands to the total number of images, %3$s and %4$s expand to links on yoast.com,
					 * %5$s expands to the anchor end tag. */
					i18n.dngettext(
						"js-text-analysis",
						"%3$sImage Keyphrase%5$s: Out of %2$d images on this page, only %1$d has an alt attribute that " +
						"reflects the topic of your text. " +
						"%4$sAdd your keyphrase or synonyms to the alt tags of more relevant images%5$s!",
						"%3$sImage Keyphrase%5$s: Out of %2$d images on this page, only %1$d have alt attributes that " +
						"reflect the topic of your text. " +
						"%4$sAdd your keyphrase or synonyms to the alt tags of more relevant images%5$s!",
						this.altProperties.withAltKeyword
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
				resultText: i18n.sprintf(
					/* Translators: %1$s expands to a link on yoast.com,
					 * %2$s expands to the anchor end tag. */
					i18n.dgettext(
						"js-text-analysis",
						"%1$sImage Keyphrase%2$s: Good job!"
					),
					this._config.urlTitle,
					"</a>"
				),
			};
		}

		if ( this.hasTooManyMatches() ) {
			return {
				score: this._config.scores.withAltTooManyKeywordMatches,
				resultText: i18n.sprintf(
					/* Translators: %1$d expands to the number of images containing an alt attribute with the keyword,
                     * %2$d expands to the total number of images, %3$s and %4$s expand to a link on yoast.com,
					 * %5$s expands to the anchor end tag. */
					i18n.dgettext(
						"js-text-analysis",
						"%3$sImage Keyphrase%5$s: Out of %2$d images on this page, %1$d have alt attributes with " +
						"words from your keyphrase or synonyms. " +
						"That's a bit much. %4$sOnly include the keyphrase or its synonyms when it really fits the image%5$s."
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
			score: this._config.scores.noAlt,
			resultText: i18n.sprintf(
				/* Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag */
				i18n.dgettext( "js-text-analysis", "%1$sImage Keyphrase%3$s: " +
					"Images on this page do not have alt attributes that reflect the topic of your text. " +
					"%2$sAdd your keyphrase or synonyms to the alt tags of relevant images%3$s!" ),
				this._config.urlTitle,
				this._config.urlCallToAction,
				"</a>"
			),
		};
	}
}
