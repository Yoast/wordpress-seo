import { merge } from "lodash-es";

import Assessment from "../../assessment";
import AssessmentResult from "../../values/AssessmentResult";
import countWords from "../../stringProcessing/countWords";
import inRange from "../../helpers/inRange";
import formatNumber from "../../helpers/formatNumber";

const inRangeEndInclusive = inRange.inRangeEndInclusive;
const inRangeStartInclusive = inRange.inRangeStartInclusive;
const inRangeStartEndInclusive = inRange.inRangeStartEndInclusive;

/**
 * Represents the assessment that will look if the keyword density is within the recommended range.
 */
class KeywordDensityAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} [config] The configuration to use.
	 * @param {number} [config.parameters.overMaximum] The percentage of keyword instances in the text that is way over the maximum.
	 * @param {number} [config.parameters.maximum] The maximum percentage of keyword instances in the text.
	 * @param {number} [config.parameters.minimum] The minimum percentage of keyword instances in the text.
	 * @param {number} [config.scores.wayOverMaximum] The score to return if there are way too many instances of keyword in the text.
	 * @param {number} [config.scores.overMaximum] The score to return if there are too many instances of keyword in the text.
	 * @param {number} [config.scores.correctDensity] The score to return if there is a good number of keyword instances in the text.
	 * @param {number} [config.scores.underMinimum] The score to return if there is not enough keyword instances in the text.
	 * @param {string} [config.url] The URL to the relevant KB article.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			parameters: {
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
			scores: {
				wayOverMaximum: -50,
				overMaximum: -10,
				correctDensity: 9,
				underMinimum: 4,
			},
			urlTitle: "<a href='https://yoa.st/33v' target='_blank'>",
			urlCallToAction: "<a href='https://yoa.st/33w' target='_blank'>",
		};

		this.identifier = "keywordDensity";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Runs the keyword density module, based on this returns an assessment
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
		const assessmentResult = new AssessmentResult();

		this._keywordCount = researcher.getResearch( "keywordCount" );

		this._keywordDensity = researcher.getResearch( "getKeywordDensity" );

		/*
		 * Use other boundaries when taking morphology into account,
		 * since multiple keyword forms can be matched.
		 */
		this._hasMorphologyData = researcher.getData( "morphology" ) !== false;
		this._locale = paper.getLocale();

		const calculatedScore = this.calculateResult( i18n );
		assessmentResult.setScore( calculatedScore.score );
		assessmentResult.setText( calculatedScore.resultText );
		assessmentResult.setHasMarks( this._keywordCount.count > 0 );

		return assessmentResult;
	}

	/**
	 * Checks whether there are no keyword matches in the text.
	 *
	 * @returns {boolean} Returns true if the keyword count is 0.
	 */
	hasNoMatches() {
		return this._keywordCount.count === 0;
	}

	/**
	 * Checks whether there are too few keyword matches in the text.
	 *
	 * Changes the boundaries based on if we have access to morphology data.
	 * (Since multiple keyword forms can be matched the boundaries should be relaxed a bit)
	 *
	 * @returns {boolean} Returns true if the rounded keyword density is between
	 *                    0 and the recommended minimum.
	 */
	hasTooFewMatches() {
		if ( this.shouldUseMorphologyBoundaries() ) {
			return inRangeStartInclusive(
				this._keywordDensity,
				0,
				this._config.parameters.multipleWordForms.minimum
			);
		}
		return inRangeStartInclusive(
			this._keywordDensity,
			0,
			this._config.parameters.noWordForms.minimum
		);
	}

	/**
	 * Checks whether there is a good number of keyword matches in the text.
	 *
	 * Changes the boundaries based on if we have access to morphology data.
	 * (Since multiple keyword forms can be matched the boundaries should be relaxed a bit)
	 *
	 * @returns {boolean} Returns true if the rounded keyword density is between
	 *                    the recommended minimum and the recommended maximum.
	 */
	hasGoodNumberOfMatches() {
		if ( this.shouldUseMorphologyBoundaries() ) {
			return inRangeStartEndInclusive(
				this._keywordDensity,
				this._config.parameters.multipleWordForms.minimum,
				this._config.parameters.multipleWordForms.maximum
			);
		}
		return inRangeStartEndInclusive(
			this._keywordDensity,
			this._config.parameters.noWordForms.minimum,
			this._config.parameters.noWordForms.maximum
		);
	}

	/**
	 * Checks whether the number of keyword matches in the text is between the
	 * recommended maximum and the specified overMaximum value.
	 *
	 * Changes the boundaries based on if we have access to morphology data.
	 * (Since multiple keyword forms can be matched the boundaries should be relaxed a bit)
	 *
	 * @returns {boolean} Returns true if the rounded keyword density is between
	 *                    the recommended maximum and the specified overMaximum
	 *                    value.
	 */
	hasTooManyMatches() {
		if ( this.shouldUseMorphologyBoundaries() ) {
			return inRangeEndInclusive(
				this._keywordDensity,
				this._config.parameters.multipleWordForms.maximum,
				this._config.parameters.multipleWordForms.overMaximum
			);
		}
		return inRangeEndInclusive(
			this._keywordDensity,
			this._config.parameters.noWordForms.maximum,
			this._config.parameters.noWordForms.overMaximum
		);
	}

	/**
	 * If this assessments should use the morphology score boundaries.
	 *
	 * @returns {boolean} if the assessment should use the morphology score boundaries.
	 */
	shouldUseMorphologyBoundaries() {
		return this._hasMorphologyData && this._locale === "en_US";
	}

	/**
	 * Returns the score for the keyword density.
	 *
	 * @param {Jed} i18n The object used for translations.
	 *
	 * @returns {Object} The object with calculated score and resultText.
	 */
	calculateResult( i18n ) {
		const max = this.shouldUseMorphologyBoundaries()
			? this._config.parameters.multipleWordForms.maximum
			: this._config.parameters.noWordForms.maximum;
		const maxText = `${ max }%`;
		const roundedKeywordDensity = formatNumber( this._keywordDensity );
		const keywordDensityPercentage = roundedKeywordDensity + "%";

		if ( this.hasNoMatches() ) {
			return {
				score: this._config.scores.underMinimum,
				resultText: i18n.sprintf(
					/* Translators:
					%1$s expands to the keyword density percentage,
					%2$d expands to the keyword count,
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
					%1$s expands to the keyword density percentage,
					%2$d expands to the keyword count,
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
					%1$s expands to the keyword density percentage,
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
					%1$s expands to the keyword density percentage,
					%2$d expands to the keyword count,
					%3$s expands to the maximum keyword density percentage,
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

		// Implicitly returns this if the rounded keyword density is higher than overMaximum.
		return {
			score: this._config.scores.wayOverMaximum,
			resultText: i18n.sprintf(
				/* Translators:
				%1$s expands to the keyword density percentage,
				%2$d expands to the keyword count,
				%3$s expands to the maximum keyword density percentage,
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
