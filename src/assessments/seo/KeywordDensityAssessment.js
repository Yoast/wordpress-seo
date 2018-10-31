import { merge } from "lodash-es";

import recommendedKeywordCount from "../../assessmentHelpers/recommendedKeywordCount.js";
import Assessment from "../../assessment";
import AssessmentResult from "../../values/AssessmentResult";
import { inRangeEndInclusive, inRangeStartEndInclusive, inRangeStartInclusive } from "../../helpers/inRange";
import { createAnchorOpeningTag } from "../../helpers/shortlinker";
import formatNumber from "../../helpers/formatNumber";
import keyphraseLengthFactor from "../../helpers/keyphraseLengthFactor.js";
import countWords from "../../stringProcessing/countWords";

/**
 * Represents the assessment that will look if the keyphrase density is within the recommended range.
 */
class KeywordDensityAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} [config] The configuration to use.
	 * In the regular analysis, if word forms are not available
	 * @param {number} [config.parametersRegular.noWordForms.overMaximum] The percentage of keyphrase instances in the text that
	 * is way over the maximum.
	 * @param {number} [config.parametersRegular.noWordForms.maximum] The maximum percentage of keyphrase instances in the text.
	 * @param {number} [config.parametersRegular.noWordForms.minimum] The minimum percentage of keyphrase instances in the text.
	 * In the regular analysis, if word forms are available
	 * @param {number} [config.parametersRegular.multipleWordForms.overMaximum] The percentage of keyphrase instances in the text that
	 * is way over the maximum.
	 * @param {number} [config.parametersRegular.multipleWordForms.maximum] The maximum percentage of keyphrase instances in the text.
	 * @param {number} [config.parametersRegular.multipleWordForms.minimum] The minimum percentage of keyphrase instances in the text.
	 * In the recalibration analysis, if word forms are not available
	 * @param {number} [config.parametersRecalibration.noWordForms.overMaximum] The percentage of keyphrase instances in the text that
	 * is way over the maximum.
	 * @param {number} [config.parametersRecalibration.noWordForms.maximum] The maximum percentage of keyphrase instances in the text.
	 * @param {number} [config.parametersRecalibration.noWordForms.minimum] The minimum percentage of keyphrase instances in the text.
	 * In the recalibration analysis, if word forms are available
	 * @param {number} [config.parametersRecalibration.multipleWordForms.overMaximum] The percentage of keyphrase instances in the text
	 * that is way over the maximum.
	 * @param {number} [config.parametersRecalibration.multipleWordForms.maximum] The maximum percentage of keyphrase instances in the text.
	 * @param {number} [config.parametersRecalibration.multipleWordForms.minimum] The minimum percentage of keyphrase instances in the text.
	 * In all analyses
	 * @param {number} [config.scores.wayOverMaximum] The score to return if there are way too many instances of keyphrase in the text.
	 * @param {number} [config.scores.overMaximum] The score to return if there are too many instances of keyphrase in the text.
	 * @param {number} [config.scores.correctDensity] The score to return if there is a good number of keyphrase instances in the text.
	 * @param {number} [config.scores.underMinimum] The score to return if there is not enough keyphrase instances in the text.
	 * @param {string} [config.url] The URL to the relevant KB article.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			parametersRegular: {
				noWordForms: {
					overMaximum: 3.5,
					maximum: 2.5,
					minimum: 0.5,
				},
				multipleWordForms: {
					overMaximum: 3.5,
					maximum: 3.0,
					minimum: 0.5,
				},
			},
			parametersRecalibration: {
				noWordForms: {
					overMaximum: 4,
					maximum: 3,
					minimum: 0.5,
				},
				multipleWordForms: {
					overMaximum: 4,
					maximum: 3.5,
					minimum: 0.5,
				},
			},
			scores: {
				wayOverMaximum: -50,
				overMaximum: -10,
				correctDensity: 9,
				underMinimum: 4,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/33v" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/33w" ),
		};

		this.identifier = "keywordDensity";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Determines correct boundaries depending on the version (Recalibration or regular) and depending on the availability
	 * of morphological forms.
	 *
	 * @param {string} text The paper text.
	 * @param {number} keyphraseLength The length of the keyphrase in words.
	 *
	 * @returns {void}
	 */
	setBoundaries( text, keyphraseLength ) {
		if ( process.env.YOAST_RECALIBRATION === "enabled" ) {
			if ( this._hasMorphologicalForms ) {
				this._boundaries = this._config.parametersRecalibration.multipleWordForms;
			} else {
				this._boundaries = this._config.parametersRecalibration.noWordForms;
			}
			this._minRecommendedKeywordCount = recommendedKeywordCount( text, keyphraseLength, this._boundaries.minimum, "min" );
			this._maxRecommendedKeywordCount = recommendedKeywordCount( text, keyphraseLength, this._boundaries.maximum, "max" );
		} else {
			if ( this._hasMorphologicalForms ) {
				this._boundaries = this._config.parametersRegular.multipleWordForms;
			} else {
				this._boundaries = this._config.parametersRegular.noWordForms;
			}
		}
	}

	/**
	 * Runs the keyphrase density module, based on this returns an assessment
	 * result with score.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 * @param {Researcher} researcher The researcher used for calling the
	 *                                research.
	 * @param {Jed} i18n The object used for translations.
	 *
	 * @returns {AssessmentResult} The result of the assessment.
	 */
	getResult( paper, researcher, i18n ) {
		// Get the environment variable.
		this._hasMorphologicalForms = researcher.getData( "morphology" ) !== false && paper.getLocale() === "en_EN";

		this._keywordCount = researcher.getResearch( "keywordCount" );
		const keyphraseLength = this._keywordCount.length;

		this.setBoundaries( paper.getText(), keyphraseLength );

		const assessmentResult = new AssessmentResult();

		this._keywordDensity = researcher.getResearch( "getKeywordDensity" );

		let calculatedScore = {};
		if ( process.env.YOAST_RECALIBRATION === "enabled" ) {
			this._keywordDensity = this._keywordDensity * keyphraseLengthFactor( keyphraseLength );
			calculatedScore = this.calculateResultRecalibration( i18n );
		} else {
			calculatedScore = this.calculateResultRegular( i18n );
		}

		assessmentResult.setScore( calculatedScore.score );
		assessmentResult.setText( calculatedScore.resultText );
		assessmentResult.setHasMarks( this._keywordCount.count > 0 );

		return assessmentResult;
	}

	/**
	 * Checks whether there are no keyphrase matches in the text.
	 *
	 * @returns {boolean} Returns true if the keyphrase count is 0.
	 */
	hasNoMatches() {
		return this._keywordCount.count === 0;
	}

	/**
	 * Checks whether there are too few keyphrase matches in the text.
	 *
	 * @returns {boolean} Returns true if the rounded keyphrase density is between
	 *                    0 and the recommended minimum.
	 */
	hasTooFewMatches() {
		return inRangeStartInclusive(
			this._keywordDensity,
			0,
			this._boundaries.minimum,
		);
	}

	/**
	 * Checks whether there is a good number of keyphrase matches in the text.
	 *
	 * @returns {boolean} Returns true if the rounded keyphrase density is between
	 *                    the recommended minimum and the recommended maximum.
	 */
	hasGoodNumberOfMatches() {
		return inRangeStartEndInclusive(
			this._keywordDensity,
			this._boundaries.minimum,
			this._boundaries.maximum
		);
	}

	/**
	 * Checks whether the number of keyphrase matches in the text is between the
	 * recommended maximum and the specified overMaximum value.
	 *
	 * @returns {boolean} Returns true if the rounded keyphrase density is between
	 *                    the recommended maximum and the specified overMaximum
	 *                    value.
	 */
	hasTooManyMatches() {
		return inRangeEndInclusive(
			this._keywordDensity,
			this._boundaries.maximum,
			this._boundaries.overMaximum
		);
	}

	/**
	 * Returns the score for the keyphrase density (for Regular analysis).
	 *
	 * @param {Jed} i18n The object used for translations.
	 *
	 * @returns {Object} The object with calculated score and resultText.
	 */
	calculateResultRegular( i18n ) {
		const max = this._boundaries.maximum;
		const maxText = `${ max }%`;
		const roundedKeywordDensity = formatNumber( this._keywordDensity );
		const keywordDensityPercentage = roundedKeywordDensity + "%";

		if ( this.hasNoMatches() ) {
			return {
				score: this._config.scores.underMinimum,
				resultText: i18n.sprintf(
					/* Translators:
					%1$s expands to the keyphrase density percentage,
					%2$d expands to the keyphrase count,
					%3$s and %4$s expand to links to Yoast.com,
					%5$s expands to the anchor end tag. */
					i18n.dgettext(
						"js-text-analysis",
						"%3$sKeyphrase density%5$s: %1$s. " +
						"This is too low; the keyphrase was found %2$d times. %4$sFocus on your keyphrase%5$s!",
					),
					keywordDensityPercentage,
					this._keywordCount.count,
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}

		if ( this.hasTooFewMatches() ) {
			return {
				score: this._config.scores.underMinimum,
				resultText: i18n.sprintf(
					/* Translators:
					%1$s expands to the keyphrase density percentage,
					%2$d expands to the keyphrase count,
					%3$s and %4$s expand to links to Yoast.com,
					%5$s expands to the anchor end tag. */
					i18n.dngettext(
						"js-text-analysis",
						"%3$sKeyphrase density%5$s: %1$s. " +
						"This is too low; the keyphrase was found %2$d time. %4$sFocus on your keyphrase%5$s!",
						"%3$sKeyphrase density%5$s: %1$s. " +
						"This is too low; the keyphrase was found %2$d times. %4$sFocus on your keyphrase%5$s!",
						this._keywordCount.count
					),
					keywordDensityPercentage,
					this._keywordCount.count,
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}

		if ( this.hasGoodNumberOfMatches()  ) {
			return {
				score: this._config.scores.correctDensity,
				resultText: i18n.sprintf(
					/* Translators:
					%1$s expands to the keyphrase density percentage,
					%2$s expands to a link to Yoast.com,
					%3$s expands to the anchor end tag. */
					i18n.dngettext(
						"js-text-analysis",
						"%2$sKeyphrase density%3$s: %1$s. " +
						"This is great!",
					),
					keywordDensityPercentage,
					this._config.urlTitle,
					"</a>"
				),
			};
		}

		if ( this.hasTooManyMatches() ) {
			return {
				score: this._config.scores.overMaximum,
				resultText: i18n.sprintf(
					/* Translators:
					%1$s expands to the keyphrase density percentage,
					%2$d expands to the keyphrase count,
					%3$s expands to the maximum keyphrase density percentage,
					%4$s and %5$s expand to links to Yoast.com,
					%6$s expands to the anchor end tag. */
					i18n.dngettext(
						"js-text-analysis",
						"%4$sKeyphrase density%6$s: %1$s. " +
						"This is over the advised %3$s maximum; the keyphrase was found %2$d time. " +
						"%5$sDon't overoptimize%6$s!",
						"%4$sKeyphrase density%6$s: %1$s. " +
						"This is over the advised %3$s maximum; the keyphrase was found %2$d times. " +
						"%5$sDon't overoptimize%6$s!",
						this._keywordCount.count
					),
					keywordDensityPercentage,
					this._keywordCount.count,
					maxText,
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}

		// Implicitly returns this if the rounded keyphrase density is higher than overMaximum.
		return {
			score: this._config.scores.wayOverMaximum,
			resultText: i18n.sprintf(
				/* Translators:
				%1$s expands to the keyphrase density percentage,
				%2$d expands to the keyphrase count,
				%3$s expands to the maximum keyphrase density percentage,
				%4$s and %5$s expand to links to Yoast.com,
				%6$s expands to the anchor end tag. */
				i18n.dngettext(
					"js-text-analysis",
					"%4$sKeyphrase density%6$s: %1$s. " +
					"This is way over the advised %3$s maximum; the keyphrase was found %2$d time. " +
					"%5$sDon't overoptimize%6$s!",
					"%4$sKeyphrase density%6$s: %1$s. " +
					"This is way over the advised %3$s maximum; the keyphrase was found %2$d times. " +
					"%5$sDon't overoptimize%6$s!",
					this._keywordCount.count
				),
				keywordDensityPercentage,
				this._keywordCount.count,
				maxText,
				this._config.urlTitle,
				this._config.urlCallToAction,
				"</a>"
			),
		};
	}

	/**
	 * Returns the score for the keyphrase density (for Recalibration).
	 *
	 * @param {Jed} i18n The object used for translations.
	 *
	 * @returns {Object} The object with calculated score and resultText.
	 */
	calculateResultRecalibration( i18n ) {
		if ( this.hasNoMatches() ) {
			return {
				score: this._config.scores.underMinimum,
				resultText: i18n.sprintf(
					/* Translators:
					%1$s and %4$s expand to links to Yoast.com,
					%2$s expands to the anchor end tag,
					%3$d expands to the recommended minimal number of times the keyphrase should occur in the text. */
					i18n.dgettext(
						"js-text-analysis",
						"%1$sKeyphrase density%2$s: The focus keyphrase was found 0 times. " +
						"That's less than the recommended minimum of %3$d times for a text of this length. " +
						"%4$sFocus on your keyphrase%2$s!",
					),
					this._config.urlTitle,
					"</a>",
					this._minRecommendedKeywordCount,
					this._config.urlCallToAction,
				),
			};
		}

		if ( this.hasTooFewMatches() ) {
			return {
				score: this._config.scores.underMinimum,
				resultText: i18n.sprintf(
					/* Translators:
					%1$s and %4$s expand to links to Yoast.com,
					%2$s expands to the anchor end tag,
					%3$d expands to the recommended minimal number of times the keyphrase should occur in the text,
					%5$d expands to the number of times the keyphrase occurred in the text. */
					i18n.dngettext(
						"js-text-analysis",
						"%1$sKeyphrase density%2$s: The focus keyphrase was found %5$d time. That's less than the " +
						"recommended minimum of %3$d times for a text of this length. %4$sFocus on your keyphrase%2$s!",
						"%1$sKeyphrase density%2$s: The focus keyphrase was found %5$d times. That's less than the " +
						"recommended minimum of %3$d times for a text of this length. %4$sFocus on your keyphrase%2$s!",
						this._keywordCount.count
					),
					this._config.urlTitle,
					"</a>",
					this._minRecommendedKeywordCount,
					this._config.urlCallToAction,
					this._keywordCount.count
				),
			};
		}

		if ( this.hasGoodNumberOfMatches()  ) {
			return {
				score: this._config.scores.correctDensity,
				resultText: i18n.sprintf(
					/* Translators:
					%1$s expands to a link to Yoast.com,
					%2$s expands to the anchor end tag,
					%3$d expands to the number of times the keyphrase occurred in the text. */
					i18n.dngettext(
						"js-text-analysis",
						"%1$sKeyphrase density%2$s: The focus keyphrase was found %3$d time. This is great!",
						"%1$sKeyphrase density%2$s: The focus keyphrase was found %3$d times. This is great!",
						this._keywordCount.count
					),
					this._config.urlTitle,
					"</a>",
					this._keywordCount.count
				),
			};
		}

		if ( this.hasTooManyMatches() ) {
			return {
				score: this._config.scores.overMaximum,
				resultText: i18n.sprintf(
					/* Translators:
					%1$s and %4$s expand to links to Yoast.com,
					%2$s expands to the anchor end tag,
					%3$d expands to the recommended maximal number of times the keyphrase should occur in the text,
					%5$d expands to the number of times the keyphrase occurred in the text. */
					i18n.dngettext(
						"js-text-analysis",
						"%1$sKeyphrase density%2$s: The focus keyphrase was found %5$d time. That's more than the " +
						"recommended maximum of %3$d times for a text of this length. %4$sDon't overoptimize%2$s!",
						"%1$sKeyphrase density%2$s: The focus keyphrase was found %5$d times. That's more than the " +
						"recommended maximum of %3$d times for a text of this length. %4$sDon't overoptimize%2$s!",
						this._keywordCount.count
					),
					this._config.urlTitle,
					"</a>",
					this._maxRecommendedKeywordCount,
					this._config.urlCallToAction,
					this._keywordCount.count
				),
			};
		}

		// Implicitly returns this if the rounded keyphrase density is higher than overMaximum.
		return {
			score: this._config.scores.wayOverMaximum,
			resultText: i18n.sprintf(
				/* Translators:
				%1$s and %4$s expand to links to Yoast.com,
				%2$s expands to the anchor end tag,
				%3$d expands to the recommended maximal number of times the keyphrase should occur in the text,
				%5$d expands to the number of times the keyphrase occurred in the text. */
				i18n.dngettext(
					"js-text-analysis",
					"%1$sKeyphrase density%2$s: The focus keyphrase was found %5$d time. That's way more than the " +
					"recommended maximum of %3$d times for a text of this length. %4$sDon't overoptimize%2$s!",
					"%1$sKeyphrase density%2$s: The focus keyphrase was found %5$d times. That's way more than the " +
					"recommended maximum of %3$d times for a text of this length. %4$sDon't overoptimize%2$s!",
					this._keywordCount.count
				),
				this._config.urlTitle,
				"</a>",
				this._maxRecommendedKeywordCount,
				this._config.urlCallToAction,
				this._keywordCount.count
			),
		};
	}


	/**
	 * Marks keywords in the text for the keyword density assessment.
	 *
	 * @returns {Array<Mark>} Marks that should be applied.
	 */
	getMarks() {
		return this._keywordCount.markings;
	}


	/**
	 * Checks whether the paper has a text with at least 100 words and a keyword
	 * is set.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 *
	 * @returns {boolean} True if applicable.
	 */
	isApplicable( paper ) {
		return paper.hasText() && paper.hasKeyword() && countWords( paper.getText() ) >= 100;
	}
}

export default KeywordDensityAssessment;
