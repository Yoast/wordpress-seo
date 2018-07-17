import * as merge from "lodash/merge";

import * as Assessment from "../../assessment";
import * as AssessmentResult from "../../values/AssessmentResult";

/**
 * Assessment to check whether the keyphrase is encountered in the first paragraph of the article.
 */
class IntroductionHasKeywordAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} config The configuration to use.
	 * @param {number} [config.parameters.recommendedMinimum] The recommended minimum of keyword occurrences in the first paragraph.
	 * @param {number} [config.scores.good] The score to return if there are enough keyword occurrences in the first paragraph.
	 * @param {number} [config.scores.bad] The score to return if there aren't enough keyword occurrences in the first paragraph.
	 * @param {string} [config.url] The URL to the relevant article on Yoast.com.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			parameters: {
				recommendedMinimum: 1,
			},
			scores: {
				good: 9,
				bad: 3,
			},
			url: "<a href='https://yoa.st/2pc' target='_blank'>",
		};

		this.identifier = "introductionKeyword";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Assesses the presence of keyphrase in the first paragraph.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 * @param {Researcher} researcher The researcher used for calling research.
	 * @param {Jed} i18n The object used for translations.
	 *
	 * @returns {AssessmentResult} The result of this assessment.
	 */
	getResult( paper, researcher, i18n ) {
		const assessmentResult = new AssessmentResult();

		this._firstParagraphMatches = researcher.getResearch( "firstParagraph" );
		const calculatedResult = this.calculateResult( i18n );

		assessmentResult.setScore( calculatedResult.score );
		assessmentResult.setText( calculatedResult.resultText );

		return assessmentResult;
	}

	/**
	 * Checks if the paper has both keyword and text.
	 *
	 * @param {Paper} paper The paper to be analyzed.
	 *
	 * @returns {boolean} Whether the assessment is applicable or not.
	 */
	isApplicable( paper ) {
		return paper.hasKeyword() && paper.hasText();
	}

	/**
	 * Returns a result based on the number of occurrences of keyphrase in the first paragraph.
	 *
	 * @param {Jed} i18n The object used for translations.
	 *
	 * @returns {Object} result object with a score and translation text.
	 */
	calculateResult( i18n ) {
		if ( this._firstParagraphMatches >= this._config.parameters.recommendedMinimum ) {
			return {
				score: this._config.scores.good,
				resultText: i18n.sprintf(
					/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag. */
					i18n.dgettext( "js-text-analysis", "The focus keyword appears in the %1$sfirst paragraph%2$s of the copy." ),
					this._config.url,
					"</a>"
				),
			};
		}

		return {
			score: this._config.scores.bad,
			resultText: i18n.sprintf(
				/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag. */
				i18n.dgettext( "js-text-analysis", "The focus keyword doesn't appear in the %1$sfirst paragraph%2$s of the copy. " +
					"Make sure the topic is clear immediately." ),
				this._config.url,
				"</a>"
			),
		};
	}
}

export default IntroductionHasKeywordAssessment;
