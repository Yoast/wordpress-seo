const Assessment = require( "../../assessment.js" );
const AssessmentResult = require( "../../values/AssessmentResult.js" );
const countWords = require( "../../stringProcessing/countWords.js" );
const topicCount = require( "../../researches/topicCount.js" );
const formatNumber = require( "../../helpers/formatNumber.js" );
const inRange = require( "../../helpers/inRange.js" );
const Mark = require( "../../values/Mark.js" );
const marker = require( "../../markers/addMark.js" );

const inRangeStartInclusive = inRange.inRangeStartInclusive;
const inRangeEndInclusive = inRange.inRangeEndInclusive;
const inRangeStartEndInclusive = inRange.inRangeStartEndInclusive;
const map = require( "lodash/map" );
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
				maxText: "3%",
				recommendedMinimum: 0.5,
				recommendedMaximum: 3,
				slightlyOverMaximum: 4,
			},
			scores: {
				tooLittle: 4,
				good: 9,
				tooMuch: -10,
				wayTooMuch: -50,
			},
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
					 *%3$s expands to the maximum topic density percentage.
					 */
					i18n.dgettext(
						"js-text-analysis",
						"The topic density is %1$s, which is way over the advised %3$s maximum;" +
						" the focus keyword and its synonyms were found %2$d times."
					),
					topicDensityPercentage,
					this._topicCount.count,
					this._config.parameters.maxText
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
					/* Translators: %1$s expands to the topic density percentage, %2$d expands to the topic count,
					 *%3$s expands to the maximum topic density percentage.
					 */
					i18n.dgettext(
						"js-text-analysis",
						"The topic density is %1$s, which is over the advised %3$s maximum;" +
						" the focus keyword and its synonyms were found %2$d times."
					),
					topicDensityPercentage,
					this._topicCount.count,
					this._config.parameters.maxText
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
					/* Translators: %1$s expands to the topic density percentage, %2$d expands to the topic count. */
					i18n.dngettext(
						"js-text-analysis",
						"The topic density is %1$s, which is great; the focus keyword and its synonyms were found %2$d time.",
						"The topic density is %1$s, which is great; the focus keyword and its synonyms were found %2$d times.",
						this._topicCount.count
					),
					topicDensityPercentage,
					this._topicCount.count
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
					/* Translators: %1$s expands to the topic density percentage, %2$d expands to the topic count. */
					i18n.dgettext(
						"js-text-analysis",
						"The topic density is %1$s, which is too low; the focus keyword and its synonyms were found %2$d times."
					),
					topicDensityPercentage,
					this._topicCount.count
				),
			};
		}

		return {
			score: this._config.scores.tooLittle,
			resultText: i18n.sprintf(
				/* Translators: %1$s expands to the topic density percentage, %2$d expands to the topic count. */
				i18n.dngettext(
					"js-text-analysis",
					"The topic density is %1$s, which is too low; the focus keyword and its synonyms were found %2$d time.",
					"The topic density is %1$s, which is too low; the focus keyword and its synonyms were found %2$d times.",
					this._topicCount.count
				),
				topicDensityPercentage,
				this._topicCount.count
			),
		};
	}

	/**
	 * Marks keywords and synonyms in the text for the topic density assessment.
	 *
	 * @param {Object} paper The paper to use for the assessment.
	 *
	 * @returns {Array<Mark>} A list of marks that should be applied.
	 */
	getMarks( paper ) {
		const topicMatches = topicCount( paper ).matches;
		return map( topicMatches, function( topicWord ) {
			return new Mark( {
				original: topicWord,
				marked: marker( topicWord ),
			} );
		} );
	}

	/**
	 * Checks if topicDensity analysis is applicable to the paper: The paper should have a text, a keyword, synonyms, and
	 * a minimal keyword count above 100 words.
	 *
	 * @param {Object} paper The paper to have the Flesch score to be calculated for.
	 * @returns {boolean} Returns true if the assessment is applicable.
	 */
	isApplicable( paper ) {
		return paper.hasText() && paper.hasKeyword() && countWords( paper.getText() ) >= 100 && paper.getKeyword().indexOf( "," ) > 0;
	}
}

module.exports = TopicDensityAssessment;

