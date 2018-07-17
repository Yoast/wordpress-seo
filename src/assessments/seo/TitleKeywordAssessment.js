import * as merge from "lodash/merge";
import * as escape from "lodash/escape";

import * as Assessment from "../../assessment";
import * as AssessmentResult from "../../values/AssessmentResult";

/**
 * Assessment to check whether the keyword is included in (the beginning of) the SEO title.
 */
class TitleKeywordAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} config The configuration to use.
	 * @param {number} [config.parameters.recommendedMinimum] The recommended minimum of keyword occurrences in the title.
	 * @param {number} [config.parameters.recommendedPosition] The recommended position of the keyword within the title.
	 * @param {number} [config.scores.good] The score to return if the keyword is found in the recommended position.
	 * @param {number} [config.scores.okay] The score to return if the keyword is found, but not at the recommended positio.
	 * @param {number} [config.scores.bad] The score to return if there are fewer keyword occurrences than the recommended minimum.
	 * @param {string} [config.url] The URL to the relevant article on Yoast.com.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			parameters: {
				recommendedMinimum: 1,
				recommendedPosition: 0,
			},
			scores: {
				good: 9,
				okay: 6,
				bad: 2,
			},
			url: "<a href='https://yoa.st/2pn' target='_blank'>",
		};

		this.identifier = "titleKeyword";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Executes the pagetitle keyword assessment and returns an assessment result.
	 *
	 * @param {Paper} paper The Paper object to assess.
	 * @param {Researcher} researcher The Researcher object containing all available researches.
	 * @param {Object} i18n The object used for translations.
	 *
	 * @returns {AssessmentResult} The result of the assessment with text and score.
	 */
	getResult( paper, researcher, i18n ) {
		this._keywordMatches = researcher.getResearch( "findKeywordInPageTitle" );
		this._keyword = escape( paper.getKeyword() );

		const assessmentResult = new AssessmentResult();

		const calculatedResult = this.calculateResult( i18n );
		assessmentResult.setScore( calculatedResult.score );
		assessmentResult.setText( calculatedResult.resultText );

		return assessmentResult;
	}

	/**
	 * Checks whether the assessment is applicable to the paper
	 *
	 * @param {Paper} paper The Paper object to assess.
	 *
	 * @returns {boolean} Whether the paper has a keyword and a title.
	 */
	isApplicable( paper ) {
		return paper.hasKeyword() && paper.hasTitle();
	}

	/**
	 * Calculates the result based on the keyphraseLength research.
	 *
	 * @param {Object} i18n The object used for translations.
	 *
	 * @returns {Object} Object with score and text.
	 */
	calculateResult( i18n ) {
		const matches = this._keywordMatches.matches;
		const position = this._keywordMatches.position;

		if ( matches < this._config.parameters.recommendedMinimum ) {
			return {
				score: this._config.scores.bad,
				resultText: i18n.sprintf(
					/* Translators: %1$s expands to the keyphrase, %2$s expands to a link on yoast.com,
					%3$s expands to the anchor end tag. */
					i18n.dgettext(
						"js-text-analysis",
						"The focus keyword '%1$s' does not appear in the %2$sSEO title%3$s."
					),
					this._keyword,
					this._config.url,
					"</a>"
				),
			};
		}
		if ( matches >= this._config.parameters.recommendedMinimum && position === this._config.parameters.recommendedPosition ) {
			return {
				score: this._config.scores.good,
				resultText: i18n.sprintf(
					/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag. */
					i18n.dgettext(
						"js-text-analysis",
						"The %1$sSEO title%2$s contains the focus keyword, at the beginning which is considered to improve rankings."
					),
					this._config.url,
					"</a>"
				),
			};
		}
		return {
			score: this._config.scores.okay,
			resultText: i18n.sprintf(
				/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag. */
				i18n.dgettext(
					"js-text-analysis",
					"The %1$sSEO title%2$s contains the focus keyword, but it does not appear at the beginning; " +
					"try and move it to the beginning."
				),
				this._config.url,
				"</a>"
			),
		};
	}
}

export default TitleKeywordAssessment;
