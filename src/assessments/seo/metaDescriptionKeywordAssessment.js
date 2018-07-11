const AssessmentResult = require( "../../values/AssessmentResult.js" );
const Assessment = require( "../../assessment.js" );
const merge = require( "lodash/merge" );

/**
 * Assessment for checking the keyword matches in the meta description.
 */
class MetaDescriptionKeywordAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} config The configuration to use.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			parameters: {
				recommendedMinimumMatches: 1,
			},
			scores: {
				good: 9,
				bad: 3,
			},
			url: "<a href='https://yoa.st/2pf' target='_blank'>",
		};

		this.identifier = "metaDescriptionKeyword";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Runs the metaDescriptionKeyword researcher and based on this, returns an assessment result with score.
	 *
	 * @param {Paper} paper             The paper to use for the assessment.
	 * @param {Researcher} researcher   The researcher used for calling research.
	 * @param {Object} i18n             The object used for translations.
	 *
	 * @returns {AssessmentResult} The assessment result.
	 */
	getResult( paper, researcher, i18n ) {
		this._keywordMatches = researcher.getResearch( "metaDescriptionKeyword" );
		let assessmentResult = new AssessmentResult();
		const calculatedResult = this.calculateResult( i18n );

		assessmentResult.setScore( calculatedResult.score );
		assessmentResult.setText( calculatedResult.resultText );

		return assessmentResult;
	}

	/**
	 * Returns the result object based on the number of keyword matches in the meta description.
	 *
	 * @param {Object} i18n The object used for translations.
	 *
	 * @returns {Object} Result object with score and text.
	 */
	calculateResult( i18n ) {
		if ( this._keywordMatches < this._config.parameters.recommendedMinimumMatches ) {
			return {
				score: this._config.scores.bad,
				resultText: i18n.sprintf(
					/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag. */
					i18n.dgettext(
						"js-text-analysis",
						"A meta description has been specified, but it %1$sdoes not contain the focus keyword%2$s."
					),
					this._config.url,
					"</a>"
				),
			};
		}

		if ( this._keywordMatches >= this._config.parameters.recommendedMinimumMatches  ) {
			return {
				score: this._config.scores.good,
				resultText: i18n.sprintf(
					/* Translators: %1$s expands to the number of keyword matches in the meta description,
					 * %2$s expands to a link on yoast.com, %3$s expands to the anchor end tag. */
					i18n.dngettext(
						"js-text-analysis",
						"The meta description %2$scontains the focus keyword%3$s. That's great.",
						"The meta description %2$scontains the focus keyword %1$d times%3$s. That's great.",
						this._keywordMatches
					),
					this._keywordMatches,
					this._config.url,
					"</a>"
				),
			};
		}
	}

	/**
	 * Checks whether the paper has a keyword and a meta description.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 *
	 * @returns {boolean} True if the paper has a keyword and a meta description.
	 */
	isApplicable( paper ) {
		return paper.hasKeyword() && paper.hasDescription();
	}
}

module.exports =  MetaDescriptionKeywordAssessment;
