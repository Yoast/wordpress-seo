const merge = require( "lodash/merge" );

const Assessment = require( "../../assessment" );
const AssessmentResult = require( "../../values/AssessmentResult" );

/**
 * Assessment to check whether the keyphrase or synonyms are encountered in the first paragraph of the article.
 */
class IntroductionKeywordAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} [config] The configuration to use.
	 * @param {number} [config.scores.good] The score to return if there is a match within one sentence in the first paragraph.
	 * @param {number} [config.scores.good] The score to return if all words are matched in the first paragraph.
	 * @param {number} [config.scores.bad] The score to return if not all words are matched in the first paragraph.
	 * @param {string} [config.url] The URL to the relevant article on Yoast.com.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			scores: {
				good: 9,
				okay: 6,
				bad: 3,
			},
			url: "<a href='https://yoa.st/2pc' target='_blank'>",
		};

		this.identifier = "introductionKeyword";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Assesses the presence of keyphrase or synonyms in the first paragraph.
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
		if ( this._firstParagraphMatches.foundInOneSentence ) {
			return {
				score: this._config.scores.good,
				resultText: i18n.sprintf(
					/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag. */
					i18n.dgettext(
						"js-text-analysis",
						"All topic words appear within one sentence in the %1$sfirst paragraph%2$s of the copy."
					),
					this._config.url,
					"</a>"
				),
			};
		}

		if ( this._firstParagraphMatches.foundInParagraph ) {
			return {
				score: this._config.scores.okay,
				resultText: i18n.sprintf(
					/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag. */
					i18n.dgettext(
						"js-text-analysis",
						"All topic words appear in the %1$sfirst paragraph%2$s of the copy, but not within one sentence."
					),
					this._config.url,
					"</a>"
				),
			};
		}

		return {
			score: this._config.scores.bad,
			resultText: i18n.sprintf(
				/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag. */
				i18n.dgettext(
					"js-text-analysis",
					"Not all topic words appear in the %1$sfirst paragraph%2$s of the copy. Make sure the topic is clear immediately."
				),
				this._config.url,
				"</a>"
			),
		};
	}
}

export default IntroductionKeywordAssessment;
