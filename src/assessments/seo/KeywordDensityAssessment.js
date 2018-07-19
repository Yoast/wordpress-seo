const merge = require( "lodash/merge" );

const Assessment = require( "../../assessment" );
const AssessmentResult = require( "../../values/AssessmentResult" );
const countWords = require( "../../stringProcessing/countWords" );
const inRange = require( "../../helpers/inRange" );
const formatNumber = require( "../../helpers/formatNumber" );
const topicCount = require( "../../researches/topicCount" );

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
				overMaximum: 3.5,
				maximum: 2.5,
				minimum: 0.5,
			},
			scores: {
				wayOverMaximum: -50,
				overMaximum: -10,
				correctDensity: 9,
				underMinimum: 4,
			},
			url: "<a href='https://yoa.st/2pe' target='_blank'>",
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

		this._keywordCount = researcher.getResearch( "keywordCount" ).count;

		this._keywordDensity = researcher.getResearch( "getKeywordDensity" );

		const calculatedScore = this.calculateResult( i18n );
		assessmentResult.setScore( calculatedScore.score );
		assessmentResult.setText( calculatedScore.resultText );
		assessmentResult.setHasMarks( this._keywordCount > 0 );

		return assessmentResult;
	}

	/**
	 * Checks whether there are no keyword matches in the text.
	 *
	 * @returns {boolean} Returns true if the keyword count is 0.
	 */
	hasNoMatches() {
		return this._keywordCount === 0;
	}

	/**
	 * Checks whether there are too few keyword matches in the text.
	 *
	 * @returns {boolean} Returns true if the rounded keyword density is between
	 *                    0 and the recommended minimum.
	 */
	hasTooFewMatches() {
		return inRangeStartInclusive(
			this._keywordDensity,
			0,
			this._config.parameters.minimum
		);
	}

	/**
	 * Checks whether there is a good number of keyword matches in the text.
	 *
	 * @returns {boolean} Returns true if the rounded keyword density is between
	 *                    the recommended minimum and the recommended maximum.
	 */
	hasGoodNumberOfMatches() {
		return inRangeStartEndInclusive(
			this._keywordDensity,
			this._config.parameters.minimum,
			this._config.parameters.maximum
		);
	}

	/**
	 * Checks whether the number of keyword matches in the text is between the
	 * recommended maximum and the specified overMaximum value.
	 *
	 * @returns {boolean} Returns true if the rounded keyword density is between
	 *                    the recommended maximum and the specified overMaximum
	 *                    value.
	 */
	hasTooManyMatches() {
		return inRangeEndInclusive(
			this._keywordDensity,
			this._config.parameters.maximum,
			this._config.parameters.overMaximum
		);
	}

	/**
	 * Returns the score for the keyword density.
	 *
	 * @param {Jed} i18n The object used for translations.
	 *
	 * @returns {Object} The object with calculated score and resultText.
	 */
	calculateResult( i18n ) {
		const max = `${ this._config.parameters.maximum}%`;
		const roundedKeywordDensity = formatNumber( this._keywordDensity );
		const keywordDensityPercentage = roundedKeywordDensity + "%";

		if ( this.hasNoMatches() ) {
			return {
				score: this._config.scores.underMinimum,
				resultText: i18n.sprintf(
					/* Translators:
					%1$s expands to the keyword density percentage,
					%2$d expands to the keyword count,
					%3$s expands to a link to a Yoast.com article about keyword density,
					%4$s expands to the anchor end tag. */
					i18n.dgettext(
						"js-text-analysis",
						"The exact-match %3$skeyword density%4$s is %1$s," +
						" which is too low; the focus keyword was found %2$d times.",
						this._keywordCount
					),
					keywordDensityPercentage,
					this._keywordCount,
					this._config.url,
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
					%3$s expands to a link to a Yoast.com article about keyword density,
					%4$s expands to the anchor end tag. */
					i18n.dngettext(
						"js-text-analysis",
						"The exact-match %3$skeyword density%4$s is %1$s," +
						" which is too low; the focus keyword was found %2$d time.",
						"The exact-match %3$skeyword density%4$s is %1$s," +
						" which is too low; the focus keyword was found %2$d times.",
						this._keywordCount
					),
					keywordDensityPercentage,
					this._keywordCount,
					this._config.url,
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
					%2$d expands to the keyword count,
					%3$s expands to a link to a Yoast.com article about keyword density,
					%4$s expands to the anchor end tag. */
					i18n.dngettext(
						"js-text-analysis",
						"The exact-match %3$skeyword density%4$s is %1$s," +
						" which is great; the focus keyword was found %2$d time.",
						"The exact-match %3$skeyword density%4$s is %1$s," +
						" which is great; the focus keyword was found %2$d times.",
						this._keywordCount
					),
					keywordDensityPercentage,
					this._keywordCount,
					this._config.url,
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
					%4$s expands to a link to a Yoast.com article about keyword density,
					%5$s expands to the anchor end tag. */
					i18n.dngettext(
						"js-text-analysis",
						"The exact-match %4$skeyword density%5$s is %1$s," +
						" which is over the advised %3$s maximum; the focus keyword was found %2$d time.",
						"The exact-match %4$skeyword density%5$s is %1$s," +
						" which is over the advised %3$s maximum; the focus keyword was found %2$d times.",
						this._keywordCount
					),
					keywordDensityPercentage,
					this._keywordCount,
					max,
					this._config.url,
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
				%4$s expands to a link to a Yoast.com article about keyword density,
				%5$s expands to the anchor end tag. */
				i18n.dngettext(
					"js-text-analysis",
					"The exact-match %4$skeyword density%5$s is %1$s," +
					" which is way over the advised %3$s maximum; the focus keyword was found %2$d time.",
					"The exact-match %4$skeyword density%5$s is %1$s," +
					" which is way over the advised %3$s maximum; the focus keyword was found %2$d times.",
					this._keywordCount
				),
				keywordDensityPercentage,
				this._keywordCount,
				max,
				this._config.url,
				"</a>"
			),
		};
	}


	/**
	 * Marks keywords in the text for the keyword density assessment.
	 *
	 * @param {Object} paper The paper to use for the assessment.
	 *
	 * @returns {Array<Mark>} Marks that should be applied.
	 */
	getMarks( paper ) {
		return topicCount( paper, true ).markings;
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
