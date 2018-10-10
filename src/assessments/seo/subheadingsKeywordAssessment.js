
import AssessmentResult from "../../values/AssessmentResult";
import Assessment from "../../assessment";
import { merge } from "lodash-es";
import { inRangeStartEndInclusive } from "../../helpers";
import { getSubheadings } from "../../stringProcessing/getSubheadings";
import formatNumber from "../../helpers/formatNumber";

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
			parameters: {
				lowerBoundary: 30,
				upperBoundary: 75,
			},
			scores: {
				tooFewMatches: 3,
				goodNumberOfMatches: 9,
				tooManyMatches: 3,
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

		const assessmentResult = new AssessmentResult();

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
	 * Checks whether there is a only one subheading and that subheading includes the keyword.
	 *
	 * @returns {boolean} Returns true if the keyword is included in the only subheading.
	 */
	hasOneOutOfOneMatch() {
		return this._subHeadings.count === 1 && this._subHeadings.matches === 1;
	}

	/**
	 * Checks whether the percentage of subheadings with the keyphrase or synonyms is within the specified recommended
	 * range (provided that there are more than 1 subheading).
	 *
	 * @returns {boolean} Returns true if the keyword is included in a sufficient number of subheadings.
	 */
	hasGoodNumberOfMatches() {
		return inRangeStartEndInclusive(
			this._subHeadings.percentReflectingTopic,
			this._config.parameters.lowerBoundary,
			this._config.parameters.upperBoundary,
		);
	}

	/**
	 * Checks whether there are too many subheadings with the keyword.
	 * The upper limit is only applicable if there is more than one subheading.
	 * If there is only one subheading with the keyphrase this would otherwise
	 * always lead to a 100% match rate.
	 *
	 * @returns {boolean} Returns true if there is more than one subheading and if
	 * the keyphrase is included in more subheadings than the recommended maximum.
	 */
	hasTooManyMatches() {
		return this._subHeadings.count > 1 && this._subHeadings.percentReflectingTopic > this._config.parameters.upperBoundary;
	}

	/**
	 * Determines the score and the Result text for the subheadings.
	 *
	 * @param {Object} i18n The object used for translations.
	 *
	 * @returns {Object} The object with the calculated score and the result text.
	 */
	calculateResult( i18n ) {
		if ( this.hasOneOutOfOneMatch() ) {
			return {
				score: this._config.scores.goodNumberOfMatches,
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

		if ( this.hasGoodNumberOfMatches() ) {
			const roundedPercentReflectingTopic = formatNumber( this._subHeadings.percentReflectingTopic ) + "%";
			return {
				score: this._config.scores.goodNumberOfMatches,
				resultText: i18n.sprintf(
					/**
					 * Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag,
					 * %3$s expands to the percentage of subheadings that reflect the topic of the copy.
					 */
					i18n.dngettext(
						"js-text-analysis",
						"%1$sKeyphrase in subheading%2$s: %3$s of your subheadings reflect the topic of your copy. Good job!"
					),
					this._config.urlTitle,
					"</a>",
					roundedPercentReflectingTopic,
				),
			};
		}

		if ( this.hasTooManyMatches() ) {
			const percentRecommendedMaximum = this._config.parameters.upperBoundary + "%";
			return {
				score: this._config.scores.tooManyMatches,
				resultText: i18n.sprintf(
					/**
					 * Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag,
					 * %3$s expands to the maximum recommended percentage of subheadings reflecting the topic,
					 * %4%s expands to a link on yoast.com, %5$s expands to the anchor end tag.
					 */
					i18n.dgettext(
						"js-text-analysis",
						"%1$sKeyphrase in subheading%2$s: More than %3$s of your subheadings reflect the topic of your copy. " +
						"That's too much. %4$sDon't over-optimize%5$s!"
					),
					this._config.urlTitle,
					"</a>",
					percentRecommendedMaximum,
					this._config.urlCallToAction,
					"</a>",
				),
			};
		}

		return {
			score: this._config.scores.tooFewMatches,
			resultText: i18n.sprintf(
				/**
				 * Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag,
				 * %3$s expands to a link on yoast.com, %4$s expands to the anchor end tag.
				 */
				i18n.dngettext(
					"js-text-analysis",
					"%1$sKeyphrase in subheading%2$s: %3$sUse more keywords or synonyms in your subheadings%4$s!"
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
