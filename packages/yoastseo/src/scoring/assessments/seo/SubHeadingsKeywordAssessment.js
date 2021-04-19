import { merge } from "lodash-es";
import { getSubheadingsTopLevel } from "../../../languageProcessing/helpers/html/getSubheadings";
import Assessment from "../assessment";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import { inRangeStartEndInclusive } from "../../helpers/assessments/inRange.js";
import AssessmentResult from "../../../values/AssessmentResult";

/**
 * Represents the assessment that checks if the keyword is present in one of the subheadings.
 */
export default class SubHeadingsKeywordAssessment extends Assessment {
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
				lowerBoundary: 0.3,
				upperBoundary: 0.75,
			},
			scores: {
				noMatches: 3,
				tooFewMatches: 3,
				goodNumberOfMatches: 9,
				tooManyMatches: 3,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/33m" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/33n" ),
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

		this._minNumberOfSubheadings = Math.ceil( this._subHeadings.count * this._config.parameters.lowerBoundary );
		this._maxNumberOfSubheadings = Math.floor( this._subHeadings.count * this._config.parameters.upperBoundary );
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
		const subheadings =  getSubheadingsTopLevel( paper.getText() );
		return subheadings.length > 0;
	}

	/**
	 * Checks whether the paper has a text and a keyword.
	 *
	 * @param {Paper}       paper       The paper to use for the assessment.
	 *
	 * @returns {boolean} True when there is text and a keyword.
	 */
	isApplicable( paper ) {
		return paper.hasText() && paper.hasKeyword() && this.hasSubheadings( paper );
	}

	/**
	 * Checks whether there are too few subheadings with the keyphrase.
	 *
	 * This is the case if the number of subheadings with the keyphrase is more than 0 but less than the specified
	 * recommended minimum.
	 *
	 * @returns {boolean} Returns true if the keyphrase is included in too few subheadings.
	 */
	hasTooFewMatches() {
		return this._subHeadings.matches > 0 && this._subHeadings.matches < this._minNumberOfSubheadings;
	}

	/**
	 * Checks whether there are too many subheadings with the keyphrase.
	 *
	 * The upper limit is only applicable if there is more than one subheading. If there is only one subheading with
	 * the keyphrase this would otherwise always lead to a 100% match rate.
	 *
	 * @returns {boolean} Returns true if there is more than one subheading and if the keyphrase is included in less
	 *                    subheadings than the recommended maximum.
	 */
	hasTooManyMatches() {
		return this._subHeadings.count > 1 && this._subHeadings.matches > this._maxNumberOfSubheadings;
	}

	/**
	 * Checks whether there is only one higher-level subheading and this subheading includes the keyphrase.
	 *
	 * @returns {boolean} Returns true if there is exactly one higher-level subheading and this
	 * subheading has a keyphrase match.
	 */
	isOneOfOne() {
		return this._subHeadings.count === 1 && this._subHeadings.matches === 1;
	}

	/**
	 * Checks whether there is a good number of subheadings with the keyphrase.
	 *
	 * This is the case if there is only one subheading and that subheading includes the keyphrase or if the number of
	 * subheadings with the keyphrase is within the specified recommended range.
	 *
	 * @returns {boolean} Returns true if the keyphrase is included in a sufficient number of subheadings.
	 */
	hasGoodNumberOfMatches() {
		return inRangeStartEndInclusive(
			this._subHeadings.matches,
			this._minNumberOfSubheadings,
			this._maxNumberOfSubheadings
		);
	}

	/**
	 * Determines the score and the Result text for the subheadings.
	 *
	 * @param {Object} i18n The object used for translations.
	 *
	 * @returns {Object} The object with the calculated score and the result text.
	 */
	calculateResult( i18n ) {
		if ( this.hasTooFewMatches() ) {
			return {
				score: this._config.scores.tooFewMatches,
				resultText: i18n.sprintf(
					/* Translators: %1$s and %2$s expand to a link on yoast.com, %3$s expands to the anchor end tag. */
					i18n.dgettext(
						"js-text-analysis",
						"%1$sKeyphrase in subheading%3$s: %2$sUse more keyphrases or synonyms in your H2 and H3 subheadings%3$s!"
					),
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}

		if ( this.hasTooManyMatches() ) {
			return {
				score: this._config.scores.tooManyMatches,
				resultText: i18n.sprintf(
					/* Translators: %1$s and %2$s expand to a link on yoast.com, %3$s expands to the anchor end tag. */
					i18n.dgettext(
						"js-text-analysis",
						"%1$sKeyphrase in subheading%3$s: More than 75%% of your H2 and H3 subheadings reflect the topic of your copy. " +
						"That's too much. %2$sDon't over-optimize%3$s!"
					),
					this._config.urlTitle,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}

		if ( this.isOneOfOne() ) {
			return {
				score: this._config.scores.goodNumberOfMatches,
				resultText: i18n.sprintf(
					/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag,
					%3$d expands to the number of subheadings containing the keyphrase. */
					i18n.dgettext(
						"js-text-analysis",
						"%1$sKeyphrase in subheading%2$s: Your H2 or H3 subheading reflects the topic of your copy. Good job!",
						this._subHeadings.matches
					),
					this._config.urlTitle,
					"</a>"
				),
			};
		}

		if ( this.hasGoodNumberOfMatches() ) {
			return {
				score: this._config.scores.goodNumberOfMatches,
				resultText: i18n.sprintf(
					/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag,
					%3$d expands to the number of subheadings containing the keyphrase. */
					i18n.dngettext(
						"js-text-analysis",
						"%1$sKeyphrase in subheading%2$s: %3$s of your H2 and H3 subheadings reflects the topic of your copy. Good job!",
						"%1$sKeyphrase in subheading%2$s: %3$s of your H2 and H3 subheadings reflect the topic of your copy. Good job!",
						this._subHeadings.matches
					),
					this._config.urlTitle,
					"</a>",
					this._subHeadings.matches
				),
			};
		}

		return {
			score: this._config.scores.noMatches,
			resultText: i18n.sprintf(
				/* Translators: %1$s and %2$s expand to a link on yoast.com, %3$s expands to the anchor end tag. */
				i18n.dgettext(
					"js-text-analysis",
					"%1$sKeyphrase in subheading%3$s: %2$sUse more keyphrases or synonyms in your H2 and H3 subheadings%3$s!"
				),
				this._config.urlTitle,
				this._config.urlCallToAction,
				"</a>"
			),
		};
	}
}
