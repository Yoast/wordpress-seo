
import AssessmentResult from "../../values/AssessmentResult";
import Assessment from "../../assessment";
import { merge } from "lodash-es";
import { getSubheadings } from "../../stringProcessing/getSubheadings";

/**
 * Represents the assessment that checks if the keyword is present in one of the subheadings.
 */
class SubHeadingsKeywordAssessment extends Assessment {
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
				noMatches: 6,
				oneMatch: 9,
				multipleMatches: 9,
			},
			urlTitle: "<a href='https://yoa.st/33m' target='_blank'>",
			urlCallToAction: "<a href='https://yoa.st/33n' target='_blank'>",
		};

		this.identifier = "subheadingsKeyword";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Runs the matchKeywordInSubheadings research and based on this returns an assessment result.
	 *
	 * @param {Paper} paper             The paper to use for the assessment.
	 * @param {Researcher} researcher   The researcher used for calling research.
	 * @param {Object} i18n             The object used for translations.
	 *
	 * @returns {AssessmentResult} The assessment result.
	 */
	getResult( paper, researcher, i18n ) {
		this._subHeadings = researcher.getResearch( "matchKeywordInSubheadings" );

		let assessmentResult = new AssessmentResult();

		const calculatedResult = this.calculateResult( i18n );
		assessmentResult.setScore( calculatedResult.score );
		assessmentResult.setText( calculatedResult.resultText );

		return assessmentResult;
	}

	/**
	 * Checks whether the paper has a subheadings.
	 *
	 * @param {Paper} paper The paper to use for the check.
	 *
	 * @returns {boolean} True when there is at least one subheading.
	 */
	hasSubheadings( paper ) {
		const subheadings = getSubheadings( paper.getText() );
		return subheadings.length > 0;
	}

	/**
	 * Checks whether the paper has a text and a keyword.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 *
	 * @returns {boolean} True when there is text and a keyword.
	 */
	isApplicable( paper ) {
		return paper.hasText() && paper.hasKeyword() && this.hasSubheadings( paper );
	}

	/**
	 * Determines the score and the Result text for the subheadings.
	 *
	 * @param {Object} i18n The object used for translations.
	 *
	 * @returns {Object} The object with the calculated score and the result text.
	 */
	calculateResult( i18n ) {
		if ( this._subHeadings.matches === 1 ) {
			return {
				score: this._config.scores.oneMatch,
				resultText: i18n.sprintf(
					/**
					 * Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag.
					 */
					i18n.dngettext(
						"js-text-analysis",
						"%1$sKeyphrase in subheading%2$s: Your subheading reflects the topic of your copy. Good job!"
					),
					this._config.urlTitle,
					"</a>",
				),
			};
		}

		if ( this._subHeadings.matches > 1 ) {
			return {
				score: this._config.scores.multipleMatches,
				resultText: i18n.sprintf(
					/**
					 * Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag,
					 * %3$s expands to the percentage of subheadings that reflect the topic of the copy.
					 */
					i18n.dngettext(
						"js-text-analysis",
						"%1$sKeyphrase in subheading%2$s: %3$s (out of %4$s) subheadings reflect the topic of your copy. Good job!"
					),
					this._config.urlTitle,
					"</a>",
					this._subHeadings.matches,
					this._subHeadings.count,
				),
			};
		}

		return {
			score: this._config.scores.noMatches,
			resultText: i18n.sprintf(
				/**
				 * Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag,
				 * %3$s expands to a link on yoast.com, %4$s expands to the anchor end tag.
				 */
				i18n.dngettext(
					"js-text-analysis",
					"%1$sKeyphrase in subheading%2$s: %3$sUse more keyphrases or synonyms in your subheadings%4$s!"
				),
				this._config.urlTitle,
				"</a>",
				this._config.urlCallToAction,
				"</a>",
			),
		};
	}
}

module.exports = SubHeadingsKeywordAssessment;
