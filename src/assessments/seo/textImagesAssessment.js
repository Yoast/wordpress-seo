import { merge } from "lodash-es";

import Assessment from "../../assessment";
import { createAnchorOpeningTag } from "../../queryStringAppender";
import AssessmentResult from "../../values/AssessmentResult";

/**
 * Represents the assessment that will look if the images have alt-tags and checks if the keyword is present in one of them.
 */
class TextImagesAssessment extends Assessment {
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
			scores: {
				noImages: 3,
				withAltKeyword: 9,
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
		const assessmentResult = new AssessmentResult();
		const imageCount = researcher.getResearch( "imageCount" );
		const altProperties = researcher.getResearch( "altTagCount" );

		const calculatedScore = this.calculateResult( imageCount, altProperties, i18n );

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
	 * @param {number} imageCount The amount of images to be checked against.
	 * @param {Object} altProperties An object containing the various alt-tags.
	 * @param {Jed} i18n The object used for translations.
	 *
	 * @returns {Object} The calculated score and the feedback string.
	 */
	calculateResult( imageCount, altProperties, i18n ) {
		if ( imageCount === 0 ) {
			return {
				score: this._config.scores.noImages,
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
		if ( altProperties.withAltKeyword > 0 ) {
			return {
				score: this._config.scores.withAltKeyword,
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
		if ( altProperties.withAltNonKeyword > 0 ) {
			return {
				score: this._config.scores.withAltNonKeyword,
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
		if ( altProperties.withAlt > 0 ) {
			return {
				score: this._config.scores.withAlt,
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
		if ( altProperties.noAlt > 0 ) {
			return {
				score: this._config.scores.noAlt,
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
}

export default TextImagesAssessment;
