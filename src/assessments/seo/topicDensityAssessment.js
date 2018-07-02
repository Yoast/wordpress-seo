const Assessment = require( "../../assessment.js" );
const AssessmentResult = require( "../../values/AssessmentResult.js" );
const countWords = require( "../../stringProcessing/countWords.js" );
const formatNumber = require( "../../helpers/formatNumber.js" );
const inRange = require( "../../helpers/inRange.js" );
const topicCount = require( "../../researches/topicCount.js" );

const inRangeStartInclusive = inRange.inRangeStartInclusive;
const inRangeEndInclusive = inRange.inRangeEndInclusive;
const inRangeStartEndInclusive = inRange.inRangeStartEndInclusive;
const merge = require( "lodash/merge" );

class TopicDensityAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} config The configuration to use.
	 * @returns {void}
	 */
	constructor( config ) {
		super();

		this.identifier = "topicDensity";

		let defaultConfig = {
			parameters: {
				maxText: "3.5%",
				recommendedMinimum: 0.5,
				recommendedMaximum: 3.5,
				slightlyOverMaximum: 4.5,
			},
			scores: {
				tooLittle: 4,
				good: 9,
				tooMuch: -10,
				wayTooMuch: -50,
			},
			url: "<a href='https://yoa.st/2pe' target='_blank'>",
		};
		this._config = merge( defaultConfig, config );
	}


	/**
	 * The assessment runs the getTopicCount and Density module, based on this returns an assessment result with score.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 * @param {Researcher} researcher The researcher used for calling research.
	 * @param {Object} i18n The object used for translations
	 * @returns {AssessmentResult} the AssessmentResult
	 */
	getResult( paper, researcher, i18n ) {
		this._topicDensity = formatNumber( researcher.getResearch( "getTopicDensity" ) );
		this._topicCount = researcher.getResearch( "topicCount" );

		const topicDensityResult = this.calculateTopicDensityResult( i18n );
		const assessmentResult = new AssessmentResult();

		assessmentResult.setScore( topicDensityResult.score );
		assessmentResult.setText( topicDensityResult.resultText );
		assessmentResult.setHasMarks( this._topicDensity > 0 );

		return assessmentResult;
	}


	/**
	 * Returns the scores and result text for topic density
	 *
	 * @param {Object} i18n The i18n object used for translations
	 *
	 * @returns {{score: number, text: string}} The assessment result
	 */
	calculateTopicDensityResult( i18n ) {
		const topicDensityPercentage = this._topicDensity + "%";

		if ( this._topicDensity > this._config.parameters.slightlyOverMaximum ) {
			return {
				score: this._config.scores.wayTooMuch,
				resultText: i18n.sprintf(
					/* Translators: %1$s expands to the topic density percentage, %2$d expands to the topic count,
					%3$s expands to the maximum topic density percentage, %4$s expands to a link to a Yoast.com article
					about keyword and topic density, %5$s expands to the anchor end tag. */
					i18n.dgettext(
						"js-text-analysis",
						"The %4$stopic density%5$s is %1$s, which is way over the advised %3$s maximum;" +
						" the focus keyword and its synonyms were found %2$d times."
					),
					topicDensityPercentage,
					this._topicCount.count,
					this._config.parameters.maxText,
					this._config.url,
					"</a>"
				),
			};
		}

		if (
			inRangeEndInclusive(
				this._topicDensity,
				this._config.parameters.recommendedMaximum,
				this._config.parameters.slightlyOverMaximum
			)
		) {
			return {
				score: this._config.scores.tooMuch,
				resultText: i18n.sprintf(
					/* Translators:	%1$s expands to the topic density percentage, %2$d expands to the topic count,
					%3$s expands to the maximum topic density percentage, %4$s expands to a link to a Yoast.com article
					about keyword and topic density, %5$s expands to the anchor end tag. */
					i18n.dgettext(
						"js-text-analysis",
						"The %4$stopic density%5$s is %1$s, which is over the advised %3$s maximum;" +
						" the focus keyword and its synonyms were found %2$d times."
					),
					topicDensityPercentage,
					this._topicCount.count,
					this._config.parameters.maxText,
					this._config.url,
					"</a>"
				),
			};
		}

		if (
			inRangeStartEndInclusive(
				this._topicDensity,
				this._config.parameters.recommendedMinimum,
				this._config.parameters.recommendedMaximum
			)
		) {
			return {
				score: this._config.scores.good,
				resultText: i18n.sprintf(
					/* Translators: %1$s expands to the topic density percentage, %2$d expands to the topic count,
					%3$s expands to a link to a Yoast.com article about keyword and topic density,
					%4$s expands to the anchor end tag. */
					i18n.dngettext(
						"js-text-analysis",
						"The %3$stopic density%4$s is %1$s, which is great; the focus keyword and its synonyms were found %2$d time.",
						"The %3$stopic density%4$s is %1$s, which is great; the focus keyword and its synonyms were found %2$d times.",
						this._topicCount.count
					),
					topicDensityPercentage,
					this._topicCount.count,
					this._config.url,
					"</a>"
				),
			};
		}


		if(
			inRangeStartInclusive(
				this._topicDensity,
				0,
				this._config.recommendedMinimum
			) && ( this._topicCount.count === 0 )
		) {
			return {
				score: this._config.scores.tooLittle,
				resultText: i18n.sprintf(
					/* Translators:	%1$s expands to the topic density percentage, %2$d expands to the topic count,
					%3$s expands to a link to a Yoast.com article about keyword and topic density,
					%4$s expands to the anchor end tag. */
					i18n.dgettext(
						"js-text-analysis",
						"The %3$stopic density%4$s is %1$s, which is too low; the focus keyword and its synonyms were found %2$d times."
					),
					topicDensityPercentage,
					this._topicCount.count,
					this._config.url,
					"</a>"
				),
			};
		}

		return {
			score: this._config.scores.tooLittle,
			resultText: i18n.sprintf(
				/* Translators: %1$s expands to the topic density percentage, %2$d expands to the topic count,
				%3$s expands to a link to a Yoast.com article about keyword and topic density,
				%4$s expands to the anchor end tag. */
				i18n.dngettext(
					"js-text-analysis",
					"The %3$stopic density%4$s is %1$s, which is too low; the focus keyword and its synonyms were found %2$d time.",
					"The %3$stopic density%4$s is %1$s, which is too low; the focus keyword and its synonyms were found %2$d times.",
					this._topicCount.count
				),
				topicDensityPercentage,
				this._topicCount.count,
				this._config.url,
				"</a>"
			),
		};
	}

	/**
	 * Marks keywords and synonyms in the text for the topic density assessment.
	 *
	 * @param {Object} paper The paper to have the topic density to be calculated for.
	 *
	 * @returns {Array<Mark>} A list of marks that should be applied.
	 */
	getMarks( paper ) {
		return topicCount( paper ).markings;
	}

	/**
	 * Checks if topicDensity analysis is applicable to the paper: The paper should have a text, a keyword, synonyms, and
	 * a minimal keyword count above 100 words.
	 *
	 * @param {Object} paper The paper to have the topic density to be calculated for.
	 *
	 * @returns {boolean} Returns true if the assessment is applicable.
	 */
	isApplicable( paper ) {
		return paper.hasText() && paper.hasKeyword() && countWords( paper.getText() ) >= 100 && paper.hasSynonyms();
	}
}

module.exports = TopicDensityAssessment;

